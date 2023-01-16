import { ChatInputCommand, Command, container } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

export class LeaveCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, preconditions: ['GuildOnly', 'InVoiceChannelOnly'] });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName('leave').setDescription('Thoat room ! Nghi 💥'), {
			idHints: ['1064627420923179018']
		});
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		if (!interaction.guild) {
			await interaction.reply('Invalid guild 🤡');
			return;
		}

		const queue = await container.player.getQueue(interaction.guild);
		// If there is no queue, return
		await queue?.destroy();

		// Return an embed to the user saying the song has been skipped
		await interaction.reply(`Bye 👋`);
		return;
	}
}
