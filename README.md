# whatsup

Demo chat app

## Technologies

Frontend: TypeScript/React/Redux

Backend: TypeScript/node.js/sequelize/postgres.

## Requirements

- node 8+
- yarn 1+
- postgress

## Getting started: backend

    cd backend

Create databases:

    createdb whatsup_dev
    createdb whatsup_test    

Install dependencies

    yarn

Run migrations:

    yarn migrate

Create `secrets.js` with jwt secret (this file is not checked in):

    echo 'module.exports = {"jwt":"VERY_SECRET_REPLACE_ME"};' > config/secrets.js

Start development server:

    yarn start

Run the unit tests:

    yarn test

## Getting started: frontend

    cd frontend
    
Install dependencies

    yarn
    
Start development server:

    yarn start

Now open http://localhost:4000 in your browser. Or even better: open the link in multiple browser windows to chat with yourself.

## TODO

- Error handling
- Front-end unit tests
- e2e tests
