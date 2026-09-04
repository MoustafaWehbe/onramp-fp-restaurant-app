FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

COPY packages/web/package.json ./packages/web/package.json

RUN npm ci

COPY packages/web ./packages/web
COPY packages/shared ./packages/shared

RUN npm run build --workspace=@fp_restaurant/web


FROM nginx:1.27-alpine

COPY --from=build /app/packages/web/dist /usr/share/nginx/html
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]