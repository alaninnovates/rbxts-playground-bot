import {
	Client,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from 'discord.js';
import { PLAYGROUND_REGEX } from '../util/constants';
import { decompressFromEncodedURIComponent } from 'lz-string';
import axios from 'axios';
import { generateCodeBlcok } from '../util/util';

export default class MessageListner {
	client: Client;
	name: string;
	constructor(client: Client) {
		this.client = client;
		this.name = 'messageCreate';
	}
	async exec(message: Message) {
		if (PLAYGROUND_REGEX.test(message.content)) {
			const match = PLAYGROUND_REGEX.exec(message.content)!;

			const url = match[0];
			const type = match[1];
			const id = match[2];
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
	}
}
