# Use an official Nginx image as the base
FROM nginx:alpine

# Copy the Angular build files
COPY dist/om-buffer-expert /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]