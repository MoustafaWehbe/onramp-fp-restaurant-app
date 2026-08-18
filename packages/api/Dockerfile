FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY packages/api/package.json ./packages/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci

COPY packages/api ./packages/api
COPY packages/shared ./packages/shared

RUN npm run build --workspace=@fp_restaurant/shared
RUN npm run build --workspace=@fp_restaurant/api
RUN cp packages/api/openapi.yaml packages/api/dist/openapi.yaml

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@fp_restaurant/api"]