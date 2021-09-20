# robloxts-bot
A bot that automatically embeds roblox-ts playground links that are uploaded to a discord server.
Based off of the typescript discord bot's feature. Created after Osyris mentioned it in the discord server.

## Selfhosting steps
First, rename .env.example to .env then fill it out
### The easy way: docker.
1. `docker build -t rbxts-bot .`
2. `docker run --name rbxts-bot -d rbxts-bot`

### Running from node
You will need node v16.6 or higher due to the usage of Discord.js v13.
1. `npm install`
2. `npm run build`
3. `npm start`

## ENV file refrence
```
DISCORD_TOKEN: Your token obtained from the discord developer portal
ALLOWED_CHANNELS: An array of channel ids'. These are the only channels that the bot will respond in.
```
