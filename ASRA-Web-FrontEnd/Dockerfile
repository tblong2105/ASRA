#### Stage 1: Build the react application
FROM node:16.15.1-slim as build-stage

WORKDIR /app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .

RUN npm run build --production

FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]



