FROM node:22-alpine

WORKDIR /app

# สร้าง user appuser และกลุ่ม appgroup
#RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy and install dependencies
COPY package*.json ./

RUN npm install --ignore-scripts

# Copy entire backend source
COPY . .

# เปลี่ยน owner ของไฟล์ใน /app ให้เป็น appuser
#RUN chown -R appuser:appgroup /app

# Generate Prisma client (ต้อง run ด้วย user ที่มีสิทธิ์เขียนไฟล์)
#USER appuser

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]
