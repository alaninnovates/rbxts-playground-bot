import { Client } from 'discord.js';

export default class ReadyListner {
	client: Client;
	once: boolean;
	name: string;
	constructor(client: Client) {
		this.client = client;
		this.once = true;
		this.name = 'ready';
	}
	exec() {
		console.log(`Logged in as ${this.client.user!.username}`);
	}
}
