FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY packages/embedding-worker/package.json ./packages/embedding-worker/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci

COPY packages/embedding-worker ./packages/embedding-worker
COPY packages/shared ./packages/shared

RUN npm run build --workspace=@fp_restaurant/shared

WORKDIR /app/packages/embedding-worker

CMD ["npm", "run", "dev"]