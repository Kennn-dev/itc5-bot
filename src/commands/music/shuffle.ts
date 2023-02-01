import { ChatInputCommand, Command, container } from '@sapphire/framework';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

export class ShuffleCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, preconditions: ['GuildOnly', 'InVoiceChannelOnly'] });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName('shuffle').setDescription(' Shuffle playlist ⏭'), {
			// idHints: ['']
		});
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		if (!interaction.guildId) {
			await interaction.reply('Invalid guild 🤡');
			return;
		}

		const queue = await container.player.getQueue(interaction.guildId);
		// If there is no queue, return
		if (!queue) {
			await interaction.reply('Khum co bai nao het ! 🤡');
			return;
		}
		// action
		await queue?.shuffle();

		// Return an embed to the user saying the song has been skipped
		return interaction.reply({
			embeds: [new EmbedBuilder().setTitle(`**Shuffled**`).setDescription(`Nhac da duoc tron lon xon ! 🤡`).setColor('Random')]
		});
	}
}
