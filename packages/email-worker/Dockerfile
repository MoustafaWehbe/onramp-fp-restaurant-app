FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY packages/email-worker/package.json ./packages/email-worker/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci

COPY packages/email-worker ./packages/email-worker
COPY packages/shared ./packages/shared

WORKDIR /app/packages/email-worker

CMD ["npm", "run", "dev"]