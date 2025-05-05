# server/Dockerfile
FROM node:20.19.0

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]
