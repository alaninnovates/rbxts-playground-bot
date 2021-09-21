import { CommandOpts, CommandWithoutName } from 'src/types/Command';

export class Command {
	protected _info: Partial<CommandOpts> = {
		commandName: '',
		description: 'No description provided',
		cooldown: 1000,
		aliases: [],
		dmEnabled: true,
		requireArgs: false,
		permissions: {
			bot: ['SEND_MESSAGES'],
			user: [],
		},
		usage: '',
		execute: () => {},
	};

	get info() {
		return this._info;
	}
	set info(value) {
		this._info = value;
	}

	get description() {
		return this._info.description!;
	}

	get commandName() {
		return this._info.commandName!;
	}

	get execute() {
		return this._info.execute!;
	}

	static createCommand(
		commandName: string,
		commandOpts: Partial<CommandWithoutName>,
		executeFunc: Function
	) {
		const command = new Command();
		command._info = {
			commandName,
			execute: executeFunc,
			...commandOpts,
		};
		return command;
	}
}
