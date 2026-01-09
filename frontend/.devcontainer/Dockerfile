FROM node:20

WORKDIR /app

# Install basic development tools (optional)
RUN apt-get update && apt-get install -y git curl

# Dependencies
# We don't copy package.json here because in devcontainer we mount the volume.
# However, to bake dependencies into the image (better performance), we can:
COPY package*.json ./
RUN npm install

# Expose Vite port
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
