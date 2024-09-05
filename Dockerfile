FROM node:latest

WORKDIR /usr/src/app

COPY dist/ ./dist/

COPY certs/ ./certs/

COPY package*.json server.js tsconfig*.json vite.config.ts ./

RUN npm install

RUN mkdir logs

EXPOSE 3000

CMD [ "npm", "run", "serv" ]