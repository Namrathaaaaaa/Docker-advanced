FROM node:18 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i 
COPY ./server.js ./


FROM node:18 AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

EXPOSE 6379

CMD ["npm","start"]





