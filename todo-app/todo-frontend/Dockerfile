FROM node:16 as base
WORKDIR /usr/src/app
ENV REACT_APP_BACKEND_URL=http://localhost:3001/
COPY . .

FROM base as test
ENV CI=true
RUN npm test

FROM base as prod
RUN npm ci
RUN npm run build
RUN npm install -g serve
CMD ["serve", "build"]