# Multi-stage Dockerfile: build (Node) -> serve (Nginx)

# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

# 2) Runtime stage (static hosting)
FROM nginx:1.27-alpine AS runtime

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config to serve under /XCStoSVG/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


