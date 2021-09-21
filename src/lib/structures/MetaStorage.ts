import { Collection } from 'discord.js';
import { Command } from './Command';

export class MetaStorage {
	private static _instance: MetaStorage;
	private _commands: Collection<string, Command> = new Collection();

	static get instance() {
		if (!this._instance) {
			this._instance = new MetaStorage();
		}
		return this._instance;
	}

	static clear() {
		this._instance = new MetaStorage();
	}

	get commands() {
		return this._commands;
	}

	addCommand(command: Command) {
		this._commands.set(command.commandName!, command);
	}

	findCommand(query: string) {
		return (
			this._commands.get(query) ||
			this._commands.find((cmd) => cmd.info.aliases!.includes(query))
		);
	}
}
