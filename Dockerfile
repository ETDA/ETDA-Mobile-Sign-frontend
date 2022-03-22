# stage1 - build react app first 
FROM node:12-alpine
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
WORKDIR /app
#ENV PATH /app/node_modules/.bin:$PATH
COPY . /app
