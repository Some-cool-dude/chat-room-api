FROM node:12

#Creating a new directory for app files and setting path in the container
RUN mkdir -p /app

#setting working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json. 
COPY package*.json /app/

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . /app/

EXPOSE 8080

# Run the server
CMD ["node", "app.js"]