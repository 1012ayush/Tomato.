# Use a lightweight Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your dev server runs on (e.g., 5173 for Vite, 3000 for React)
EXPOSE 3000

# Command to start the app
CMD ["npm", "run", "dev", "--", "--host"]