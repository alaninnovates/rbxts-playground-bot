import {
	Client,
	Collection,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from 'discord.js';
import { PLAYGROUND_REGEX } from '../util/constants';
import { decompressFromEncodedURIComponent } from 'lz-string';
import axios from 'axios';
import { generateCodeBlcok } from '../util/util';
import { MetaStorage } from '@lib/structures/MetaStorage';

const allowedChannels = JSON.parse(process.env.ALLOWED_CHANNELS!) as string[];
const prefix = process.env.PREFIX!;

export default class MessageListner {
	client: Client;
	name: string;
	private _cooldowns: Collection<string, Collection<string, number>> =
		new Collection();
	constructor(client: Client) {
		this.client = client;
		this.name = 'messageCreate';
	}
	async exec(message: Message) {
		if (
			allowedChannels.includes(message.channel.id) &&
			PLAYGROUND_REGEX.test(message.content)
		) {
			const [url, type, id] = PLAYGROUND_REGEX.exec(message.content)!;
			// console.log(type, id);

			if (message.content.length === url.length) {
				message.delete();
			}

			let res;
			switch (type) {
				case 'code':
					const decompressed = decompressFromEncodedURIComponent(id);
					if (decompressed !== null) {
						res = decompressed;
					}
					break;
				case 'gist':
					try {
						const response = await axios.get(
							`https://api.github.com/gists/${id}`
						);
						// console.log(response.data);
						if (response.status === 200) {
							const gistData = response.data;
							res = (Object.values(gistData.files)[0] as any)
								.content;
						}
					} catch {}
					break;
			}
			if (!res) {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle('Typescript Playground')
							.setAuthor(
								message.author.username,
								message.author.avatarURL()!
							)
							.setDescription('Error! No valid content found.')
							.setColor('RED'),
					],
					components: [
						new MessageActionRow().addComponents(
							new MessageButton()
								.setCustomId('deleteEmbed')
								.setLabel('Delete')
								// Trash emoji
								.setEmoji('🗑')
								.setStyle('DANGER')
						),
					],
				});
			} else if (res.length < 1800) {
				const typeStr = type === 'gist' ? 'Gist' : 'Playground';
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle(`Typescript ${typeStr}`)
							.setAuthor(
								message.author.username,
								message.author.avatarURL()!
							)
							.setDescription(generateCodeBlcok('ts', res))
							.setColor('GREEN'),
					],
					components: [
						new MessageActionRow().addComponents(
							new MessageButton()
								.setLabel(`${typeStr} URL`)
								.setURL(url)
								.setStyle('LINK'),
							new MessageButton()
								.setCustomId('deleteEmbed')
								.setLabel('Delete')
								// Trash emoji
								.setEmoji('🗑')
								.setStyle('DANGER')
						),
					],
				});
			} else if (res.length > 1800) {
				//
			}
		}
		if (!message.content.startsWith(prefix)) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift()!.toLowerCase();
		const command = MetaStorage.instance.findCommand(commandName);
		if (!command) return;

		if (!command.info.dmEnabled && message.channel.type === 'DM') {
			return message.reply("I can't execute that command inside DMs!");
		}

		if (command.info.permissions && message.channel.type !== 'DM') {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (
				!authorPerms ||
				!authorPerms.has(command.info.permissions.user)
			) {
				return message.reply('You can not do this!');
			}

			const clientPerms = message.channel.permissionsFor(
				message.client.user!.id
			);
			if (
				!clientPerms ||
				!clientPerms.has(command.info.permissions.user)
			) {
				return message.reply(
					'The bot does not have the required permissions to do this!'
				);
			}
		}

		if (command.info.requireArgs && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.info.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.commandName} ${command.info.usage}\``;
			}

			return message.channel.send(reply);
		}

		if (!this._cooldowns.has(command.commandName)) {
			this._cooldowns.set(command.commandName, new Collection());
		}

		const now = Date.now();
		const timestamps = this._cooldowns.get(command.commandName)!;
		const cooldownAmount = (command.info.cooldown || 3) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime =
				timestamps.get(message.author.id)! + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(
					`please wait ${timeLeft.toFixed(
						1
					)} more second(s) before reusing the \`${
						command.commandName
					}\` command.`
				);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		command.execute(message);
	}
}
