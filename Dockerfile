# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm i --silent

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Change ownership of the working directory to the node user
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"]