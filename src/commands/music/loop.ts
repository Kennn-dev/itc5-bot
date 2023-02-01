import { ChatInputCommand, Command } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

export class LoopCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, preconditions: ['GuildOnly', 'InVoiceChannelOnly'] });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName('loop').setDescription('Loop danh sach nhac 🔁'), {
			// idHints: ['1064619465670660136']
		});
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		return interaction.reply('Loop mode ');
	}
}
