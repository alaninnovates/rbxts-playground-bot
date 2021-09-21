import { PermissionResolvable } from 'discord.js';

export interface CommandOpts {
	commandName: string;
	description: string;
	cooldown: number;
	aliases: string[];
	dmEnabled: boolean;
	requireArgs: boolean;
	permissions: {
		bot: PermissionResolvable[];
		user: PermissionResolvable[];
	};
	usage: string;
	execute: Function;
}

export type CommandWithoutName = Omit<CommandOpts, 'commandName' | 'execute'>;
