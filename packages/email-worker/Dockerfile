FROM node:22-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy workspace packages
COPY packages ./packages

# Install dependencies
RUN npm install

# Move into worker package
WORKDIR /app/packages/email-worker

CMD ["npm", "run", "dev"]