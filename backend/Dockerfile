# Base stage
FROM node:20 AS base

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Development stage
FROM base AS development

# Copy additional development-specific configuration files
COPY ts-node-dev.json .

# Make uploads dir in development setup
RUN mkdir -p /app/uploads

# Expose port 5000 for development
EXPOSE 5000

# Command to run the application in development mode
CMD ["npm", "run", "devstart"]

# Build stage
FROM base AS build

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Copy package.json and package-lock.json for production install
COPY --from=build /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy compiled JavaScript files
COPY --from=build /app/dist ./dist

# Make uploads dir in production
RUN mkdir -p /app/uploads

# Expose port for production
EXPOSE 5000

# Set environment variable for production
ENV NODE_ENV=production

# Command to run the application in production mode
CMD ["npm", "run", "start"]