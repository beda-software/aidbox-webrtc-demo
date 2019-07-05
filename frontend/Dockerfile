FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /app/frontend
COPY ["package.json", "yarn.lock", "npm-shrinkwrap.json*", "./"]
RUN npm i -g yarn react-scripts && yarn && mv node_modules ../
COPY . .
EXPOSE 3000
CMD yarn start
