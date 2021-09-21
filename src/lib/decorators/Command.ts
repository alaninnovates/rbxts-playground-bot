import { MetaStorage } from '@lib/structures/MetaStorage';
import { Command as CmdStruct } from '@lib/structures/Command';
import { CommandWithoutName } from 'src/types/Command';

export function Command(
	commandName: string,
	commandOpts: Partial<CommandWithoutName>
) {
	return (
		_target: Object,
		_key: string,
		descriptor: PropertyDescriptor
	): any => {
		const command = CmdStruct.createCommand(
			commandName,
			commandOpts,
			descriptor.value
		);

		MetaStorage.instance.addCommand(command);
	};
}
