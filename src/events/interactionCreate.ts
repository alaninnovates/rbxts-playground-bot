import { Client, Interaction, Message } from 'discord.js';

export default class ReadyListner {
	client: Client;
	name: string;
	constructor(client: Client) {
		this.client = client;
		this.name = 'interactionCreate';
	}
	exec(interaction: Interaction) {
		if (!interaction.isButton()) return;
		if (interaction.customId === 'deleteEmbed') {
			(interaction.message as Message).delete();
		}
	}
}
