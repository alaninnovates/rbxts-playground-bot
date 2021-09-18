import { Client, Message, MessageEmbed } from 'discord.js';
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
			const type = match[1];
			const id = match[2];
			// console.log(type, id);

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
							.setTitle('Code content')
							.setDescription('Error! No content found.')
							.setColor('RED'),
					],
				});
			} else if (res.length < 1800) {
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle('Code content')
							.setDescription(generateCodeBlcok('ts', res))
							.setColor('GREEN'),
					],
				});
			} else if (res.length > 1800) {
				//
			}
		}
	}
}
