import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Box, IconButton, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import TableViewIcon from '@mui/icons-material/TableView';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorageIcon from '@mui/icons-material/Storage';

const SidebarComponent = ({ isCollapsed, setIsCollapsed, toggled, setToggled, broken, setBroken, handleLogout }) => {
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  return (
    <Sidebar
      collapsed={isCollapsed}
      toggled={toggled}
      onBackdropClick={() => setToggled(false)}
      onBreakPoint={setBroken}
      breakPoint="md"
      style={{ height: '100vh', backgroundColor: '#ff5e00ff' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, marginBottom: '32px', overflowY: 'auto' }}>
          <Menu iconShape="square">
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{ margin: '10px 0 20px 0' }}
            >
              {!isCollapsed && (
                <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                  <Typography>ADMIN PAGES</Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src="/assets/images/nu_logo.png"
                    style={{ cursor: 'pointer', borderRadius: '50%' }}
                  />
                </Box>
              </Box>
            )}

            <MenuItem
              icon={<HomeOutlinedIcon />}
              component={<Link to="/dashboard" />}
              active={location.pathname === '/dashboard'}
            >
              Dashboard
            </MenuItem>

            <SubMenu
              icon={<MapOutlinedIcon />}
              label="Data"
              active={['/about', '/manage-data'].includes(location.pathname)}
            >
              <MenuItem
                icon={<TableViewIcon />}
                component={<Link to="/about" />}
                active={location.pathname === '/about'}
              >
                Table
              </MenuItem>
              {userRole === 'admin' && (
                <MenuItem
                  icon={<StorageIcon />}
                  component={<Link to="/manage-data" />}
                  active={location.pathname === '/manage-data'}
                >
                  จัดการข้อมูลเชิงพื้นที่
                </MenuItem>
              )}
            </SubMenu>

            <div style={{ padding: '0 24px', marginBottom: '8px', marginTop: '32px' }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: isCollapsed ? 0 : 0.5, letterSpacing: '0.5px' }}
              >
                Extra
              </Typography>
            </div>

            <Menu>
              <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem>
              <MenuItem
                icon={<LogoutIcon />}
                onClick={handleLogout}
                style={{ marginTop: '16px' }}
              >
                Logout
              </MenuItem>
              <MenuItem
                icon={<ArrowBackIcon />}
                component={<Link to="/" />}
                active={location.pathname === '/'}
              >
                Back to Geonode
              </MenuItem>
            </Menu>
          </Menu>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;