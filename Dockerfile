# Use a Node.js image as a base
FROM node:18.10

# Set the working directory
WORKDIR /app

# Install Angular CLI and Firebase CLI
RUN npm install -g @angular/cli firebase-tools

# Copy package.json and package-lock.json (if available)
COPY om-buffer-expert/package*.json ./

# Install dependencies
RUN npm install

# Copy the contents of your project to the container
COPY om-buffer-expert/ .

# Build the Angular project
RUN ng build --configuration production

# Command to deploy to Firebase
CMD ["firebase", "deploy", "--token", "1//01JveM_mCfZTbCgYIARAAGAESNwF-L9IrCVcWY40PLdjLdqZTXKSmJXG3DsRnt4cltkFTmJgiVuwwGM0zgoNDmoGBJtIosf66qRk", "--project", "buffer-designer"]
