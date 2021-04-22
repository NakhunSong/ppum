FROM node:12.18.4-alpine3.9
WORKDIR /ppum-backend
COPY ./yarn.lock /ppum-backend/
COPY ./package.json /ppum-backend/
RUN yarn install
COPY . /ppum-backend/
RUN npm i -g @nestjs/cli
CMD yarn start:dev