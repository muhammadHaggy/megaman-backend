# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm ci --only=production

# Install Prisma CLI
RUN npm install prisma --save-dev

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Bundle app source
COPY . .

RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]