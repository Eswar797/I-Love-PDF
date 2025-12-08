# Multi-stage build for production
FROM node:18-alpine AS builder

# Build frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ ./

# Copy built frontend
COPY --from=builder /app/client/dist ./public

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "index.js"]

