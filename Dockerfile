# Use Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 8080

# Start the app
CMD ["node", "index.js"]
