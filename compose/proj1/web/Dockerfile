FROM node:14.17.3-alpine3.14 AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci 
COPY ./server.js ./


FROM node:14.17.3-alpine3.14 AS production

COPY --from=builder /usr/src/app ./

EXPOSE 6379

CMD [ "npm","start" ]





