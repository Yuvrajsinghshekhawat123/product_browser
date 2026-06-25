# --- Stage 1: Build React App ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set Vite build-time environment arguments (required for compiler injection)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compile code to static bundle (dist/ folder)
RUN npm run build

# --- Stage 2: Production Server ---
FROM nginx:stable-alpine

# Copy built files from Node builder stage to Nginx static serve location
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx configuration with our custom reverse-proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
