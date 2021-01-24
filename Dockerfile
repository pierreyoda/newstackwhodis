FROM node:15-alpine

WORKDIR /src/app/prava/

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000
CMD yarn start
