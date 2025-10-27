const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET user count
app.get('/api/users/count', authenticateToken, async (req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Error fetching user count' });
  }
});

// GET spatial data
app.get('/api/spatial-data', authenticateToken, async (req, res) => {
  try {
    const data = await prisma.spatialData.findMany();
    res.json(data);
  } catch (error) {
    console.error('Error fetching spatial data:', error);
    res.status(500).json({ message: 'Error fetching spatial data' });
  }
});

// POST spatial data
app.post('/api/spatial-data', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  const { name, category, description, group, wfsGetUrl, wfsPostUrl } = req.body;
  try {
    const wmsUrl = 'http://localhost:8080/geoserver/wms';
    const data = await prisma.spatialData.create({
      data: {
        name,
        category,
        description: description || `ข้อมูล ${name}`,
        group: group || '📂 อื่นๆ',
        wfsGetUrl: wfsGetUrl || wmsUrl,
        wfsPostUrl: wfsPostUrl || wmsUrl,
      },
    });
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating spatial data:', error);
    res.status(500).json({ message: 'Error creating spatial data' });
  }
});

// PUT spatial data
app.put('/api/spatial-data/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  const dataId = parseInt(req.params.id);
  const { name, category, description, group, wfsGetUrl, wfsPostUrl } = req.body;
  try {
    const data = await prisma.spatialData.findUnique({ where: { id: dataId } });
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    const updatedData = await prisma.spatialData.update({
      where: { id: dataId },
      data: {
        name,
        category,
        description: description || data.description,
        group: group || data.group,
        wfsGetUrl: wfsGetUrl || data.wfsGetUrl,
        wfsPostUrl: wfsPostUrl || data.wfsPostUrl,
      },
    });
    res.json(updatedData);
  } catch (error) {
    console.error('Error updating spatial data:', error);
    res.status(500).json({ message: 'Error updating spatial data' });
  }
});

// DELETE spatial data
app.delete('/api/spatial-data/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  const dataId = parseInt(req.params.id);
  try {
    await prisma.spatialData.delete({ where: { id: dataId } });
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting spatial data:', error);
    res.status(500).json({ message: 'Error deleting spatial data' });
  }
});

// GET logs
app.get('/api/logs', authenticateToken, async (req, res) => {
  try {
    const logs = await prisma.log.findMany({
      include: {
        user: true, // ดึงข้อมูลจากตาราง User ผ่าน relation
      },
    });
    const formattedLogs = logs.map(log => {
      if (!log.user) {
        console.warn(`Log ID ${log.id} has no associated user`);
        return {
          id: log.id,
          userId: log.userId,
          actionType: log.actionType,
          actionDetails: log.actionDetails,
          isSuccess: log.isSuccess,
          timestamp: log.timestamp,
          device: log.device,
          userName: 'Unknown User',
          role: 'Unknown Role',
        };
      }
      return {
        id: log.id,
        userId: log.userId,
        actionType: log.actionType,
        actionDetails: log.actionDetails,
        isSuccess: log.isSuccess,
        timestamp: log.timestamp,
        device: log.device,
        userName: log.user.name || 'Unknown User',
        role: log.user.role || 'Unknown Role',
      };
    });
    res.json(formattedLogs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

// DELETE log
app.delete('/api/logs/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  const logId = parseInt(req.params.id);
  try {
    await prisma.log.delete({ where: { id: logId } });
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ message: 'Error deleting log' });
  }
});

// POST logs
app.post('/api/logs', authenticateToken, async (req, res) => {
  const { actionType, actionDetails, isSuccess = true, device = 'Unknown' } = req.body;
  if (!actionType) {
    return res.status(400).json({ message: 'actionType is required' });
  }

  console.log('Received POST /api/logs:', { userId: req.user.id, actionType, actionDetails, isSuccess, device }); // Debug
  try {
    // ตรวจสอบว่า userId มีในตาราง User
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: `User with ID ${req.user.id} not found` });
    }

    const log = await prisma.log.create({
      data: {
        userId: req.user.id,
        actionType,
        actionDetails,
        isSuccess,
        timestamp: new Date(),
        device,
      },
    });
    console.log('Log created successfully with ID:', log.id); // Debug
    res.status(201).json(log);
  } catch (error) {
    console.error('Error creating log:', error.message, { stack: error.stack }); // Debug
    res.status(500).json({ message: 'Error creating log', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});