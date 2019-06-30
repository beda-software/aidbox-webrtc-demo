FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /app/backend
COPY ["package.json", "yarn.lock", "npm-shrinkwrap.json*", "./"]
RUN npm i -g yarn && yarn && mv node_modules ../
COPY . .
EXPOSE 3001
CMD yarn start
