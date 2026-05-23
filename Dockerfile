# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files and build assets
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built static files to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
