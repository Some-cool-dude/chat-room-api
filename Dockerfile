FROM node:12

# Create an app directory in the docker
WORKDIR /app

# Copy the package.json and package-lock.json. 
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . ./

EXPOSE 8080

# Run the server
CMD node app.js