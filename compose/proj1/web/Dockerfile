FROM node:latest AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i 
COPY ./server.js ./


FROM node:lts-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

EXPOSE 6379

CMD ["node","server.js"]





