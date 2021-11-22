# Approt-backend

This repository contains the backend for the approt application.

## Requirements
You need [node](https://nodejs.org/en/) to run the project. Since the expo client uses tunnels in the frontend, you need to setup [ngrok](https://ngrok.com/) with a user account.

#### Note, you also need the proper .env file to develop the app store version of the application.

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install dependencies with the following command.

```bash
npm install
```

## Usage

First, start the backend with the following command.

```bash
npm run dev
```
#### Ignore the steps below if you are only developing for the backend.
Second, start ngrok in another terminal instance. The application is currently using port 3001, therefore the port value.

```bash
ngrok http -host-header=localhost 3001
```

#### Finally, copy/paste the abcxyz.ngrok.io link to the .env of the frontend. At this moment, we are using the free plan, so this copy/pasting method is the preferred way to develop the application when developing features for both frontend and backend.


## Heroku

[This application is hosted on heroku](https://blooming-escarpment-41791.herokuapp.com)

#### Production changes go through github actions in the main branch

## Authors
Anton Moroz, Susanna Ritala.