FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
RUN mkdir -p /app/data && chmod 777 /app/data
CMD ["node", "dist/main", "data/generated.txt", "data/processed.txt"]