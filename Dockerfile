FROM node:latest

WORKDIR /usr/src/rbxts-bot

COPY package.json /usr/src/rbxts-bot/package.json
COPY package-lock.json /usr/src/rbxts-bot/package-lock.json
RUN npm ci

COPY . /usr/src/rbxts-bot

RUN npm run build

CMD ["npm", "start"]