# server/Dockerfile
FROM node:20.19.0

WORKDIR /app


COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]
