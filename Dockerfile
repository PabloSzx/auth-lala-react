FROM node:11.6

WORKDIR /home/auth-lala-react

COPY . .


RUN yarn

RUN yarn build
