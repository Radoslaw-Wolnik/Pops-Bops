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

# Expose port 5173 for development purposes
EXPOSE 5173

# Command to run the development server
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy the built app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Command to run the nginx server
CMD ["nginx", "-g", "daemon off;"]