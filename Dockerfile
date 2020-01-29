FROM node:12-alpine

WORKDIR /usr/src/app

ARG DOCKER_ENV

ENV NODE_ENV=${DOCKER_ENV}

COPY . .

RUN npm install --silent

CMD ["npm", "start"]