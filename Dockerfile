# Étape 1: Build du frontend React
FROM node:18-alpine AS frontend-build
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ ./
RUN npm run build

# Étape 2: Build du backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Étape 3: Image finale avec backend et frontend build
FROM node:18-alpine
WORKDIR /app

# Copier le backend
COPY --from=backend-build /app/backend ./backend

# Copier le build du frontend
COPY --from=frontend-build /app/web/build ./backend/public

# Installer serve globalement pour servir le frontend si nécessaire
RUN npm install -g serve

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "src/server.js"]
