# pull official base image
FROM node:13.12.0-alpine as build-step

# set working directory
WORKDIR /app

EXPOSE 80

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./


RUN npm install --silent

# add app
COPY ./src ./src
COPY ./public ./public

# start app
CMD ["npm", "start"]
