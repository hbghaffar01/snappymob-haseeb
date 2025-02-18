# Snappymob Application Programming Challenge
## By Haseeb Ghaffar

## Overview

This project is designed to generate random data and process it using a NestJS application. The generated data is stored in a file, and a separate script processes this data and saves the output to another file. The entire setup is containerized using Docker and Docker Compose for easy deployment and execution.

## Endpoint
- After running docker-compose up --build in terminal and also npm run start:dev you can test these endpoint.

# Generate file
curl -X POST http://localhost:3000/generator/generate

# Process file
curl -X POST http://localhost:3000/processor/process

## Commands

```bash
# Install
npm i
OR
yarn install

# development
$ npm run start

# docker
$ docker-compose up --build

# build
$ npm run build

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod