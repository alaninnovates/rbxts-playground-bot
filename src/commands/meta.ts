import { Command, Group } from '@lib/decorators';
import { Message } from 'discord.js';

@Group('')
export default class MetaCommands {
	@Command('help', {
		description: 'reee',
		usage: '[command name]',
		cooldown: 3000,
	})
	helpCommand(message: Message) {
		message.channel.send('hello');
	}
}
