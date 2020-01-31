# omdb_movies_rest_api_v2

## Description

REST API made with [NestJS](https://nestjs.com/) and supplied by [OMDB](https://www.omdbapi.com/).

## Setup

```bash
# install dependencies
$ npm install
```

```bash
#build docker container and pass the DOCKER_ENV(NODE_ENV) variable
$ docker-compose build --build-arg DOCKER_ENV=(development || production || test) --build-arg OMDB_KEY=testkey
```

You may need root privileges to run the command above.

## Running the app

```bash
$ docker-compose up
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Usage

### GET '/movies'

Lists all movies in the database.

### POST '/movies'

Fetches movie data from OMDB API either by `imdbId` or movie `title`.

```json
{
  "imdbId": "tt0095016"
}
```

```json
{
  "title": "Die Hard"
}
```

### GET '/comments'

Lists all comments in the database.

### POST '/comments'

Creates a comment and connects it to a movie entity.

```json
{
  "imdbId": "tt0095016",
  "user": "Jake Peralta",
  "text": "My totes fav movie.",
  "rating": 10
}
```

Request body is validated as follows:
 - `imdbId` must exist in OMDB database,
 - `user` must be a string that's not empty with no more than 64 characters of length,
 - `text` must be a string that's not empty with no more than 256 characters of length,
 - `rating` must be a number between 1 and 10.

 ## Live version

 Live version of the app is available at [my K8S cluster](http://35.228.200.103:5000/).