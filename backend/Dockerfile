# Use Node.js LTS version as base image
FROM node:20 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build TypeScript
RUN npm run build

# Development stage
FROM node:20 AS development

WORKDIR /app

# Copy all files from the builder stage
COPY --from=builder /app .

# Copy additional development-specific configuration files
COPY ts-node-dev.json .
COPY ssl/cert/certificate.pem /app/cert/certificate.pem
COPY ssl/cert/private-key.pem /app/cert/private-key.pem

# make uploads dir in development setup
RUN mkdir -p /app/uploads

# Reinstall node_modules to ensure compatibility
RUN npm ci

# Expose port 5000 for development
EXPOSE 5000 5443

# Command to run the application in development mode
# CMD ["npm", "run", "devstart"]
# command specified in docker-compose insted of here

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Copy package.json and package-lock.json for production install
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy compiled JavaScript files
COPY --from=builder /app/dist ./dist

# copy the certificate, private key
COPY ssl/cert/certificate.pem /app/cert/certificate.pem
COPY ssl/cert/private-key.pem /app/cert/private-key.pem

# make uploads dir in production
RUN mkdir -p /app/uploads

# Expose ports for production
EXPOSE 5000 5443

# Set environment variable for production
ENV NODE_ENV=production

# Command to run the application in production mode
# CMD ["npm", "run", "start"]
