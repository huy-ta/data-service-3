FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

CMD ["npm", "run", "dev"]
