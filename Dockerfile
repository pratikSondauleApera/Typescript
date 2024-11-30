FROM node:18-alpine

WORKDIR /usr/src/app

ENV PORT ''

ENV DATABASE_URL ''

ENV JWT_SECRET ''

ENV FILEPATH ''

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm", "start" ]