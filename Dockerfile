# ==============================================================================
# Stage 1: Build Frontend Static Assets (Node.js LTS)
# ==============================================================================
FROM node:22-alpine AS build
WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Copy package descriptors for optimal layer caching
COPY package*.json ./
RUN npm ci

# Copy full source tree
COPY . .

# Compile TypeScript and build production bundle via Vite
RUN npm run build

# ==============================================================================
# Stage 2: Production Web Server (Lightweight Nginx Alpine)
# ==============================================================================
FROM nginx:alpine-slim AS runtime

# Remove default boilerplate configuration and static files
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy customized Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled SPA bundle from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
