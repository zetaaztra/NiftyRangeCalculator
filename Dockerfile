# Base image for Node.js
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy HTML, CSS, and JS files to the container
COPY src/main/resources /app

# Expose port 80
EXPOSE 80

# Start a simple web server using Node.js
RUN npm install -g http-server
CMD ["http-server", "-p", "80"]
