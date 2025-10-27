# base image
FROM node:22-alpine

# set working directory
WORKDIR /app

# สร้าง user ธรรมดา (ไม่ใช่ root)
#RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# copy package.json & lock file
COPY package*.json ./

# install dependencies
RUN npm install --ignore-scripts

# copy rest of the frontend app
COPY . .

# เปลี่ยนสิทธิ์โฟลเดอร์ให้ user ธรรมดาเข้าถึงได้
#RUN chown -R appuser:appgroup /app

# เปลี่ยนไปใช้ user ธรรมดา
#USER appuser

# expose Vite default port
EXPOSE 5173

# run the dev server
CMD ["npm", "run", "dev"]
