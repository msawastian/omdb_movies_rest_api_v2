FROM node:12-alpine

WORKDIR /usr/src/app

ARG DOCKER_ENV

ARG OMDB_KEY

ENV NODE_ENV=${DOCKER_ENV}
ENV OMDB_API_KEY=${OMDB_KEY}
ENV PORT=5000

COPY . .

RUN npm install --silent
RUN npm install --global --silent @nestjs/cli@6.14

CMD ["npm", "start"]