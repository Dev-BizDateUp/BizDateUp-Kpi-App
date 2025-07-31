# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
# Generate Prisma Client


# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000
RUN npx prisma generate

# Start the application
CMD ["node", "index.js"]
