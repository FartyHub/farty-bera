# Use the official Node.js image as the base image
FROM node:18.19-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the Next.js project into the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

WORKDIR /app/dist/apps/web

# Command to run Next.js application
CMD ["npm", "start"]
