FROM node:15

WORKDIR /usr/src/app
COPY . .
RUN npm install \
    && npm run tsc
CMD ["npm", "run", "dev"]