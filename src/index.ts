import 'module-alias/register';
import fs from 'fs';
import { config } from 'dotenv';
import { Client, Intents } from 'discord.js';
import { checkEnv } from '@util/checkEnv';

config();

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

(async () => {
	const eventFiles = fs
		.readdirSync('./dist/events')
		.filter((file) => file.endsWith('.js'));

	for (const file of eventFiles) {
		const event = new (await import(`./events/${file}`)).default(client);
		if (event.once) {
			client.once(event.name, (...args) => event.exec(...args));
		} else {
			client.on(event.name, (...args) => event.exec(...args));
		}
	}
	const commandFiles = fs
		.readdirSync('./dist/commands')
		.filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		await import(`./commands/${file}`);
	}
})();

checkEnv();
client.login(process.env.DISCORD_TOKEN);
