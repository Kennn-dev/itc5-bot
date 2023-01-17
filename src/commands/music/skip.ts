import { ChatInputCommand, Command, container } from '@sapphire/framework';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

export class SkipCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options, preconditions: ['GuildOnly', 'InVoiceChannelOnly'] });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName('skip').setDescription(' Skip nhac ⏭'), {
			idHints: ['1064619465670660136']
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
		const currentSong = queue.nowPlaying;
		await queue?.skip();

		if (!currentSong) {
			return interaction.reply('No Song');
		}
		// Return an embed to the user saying the song has been skipped
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`**[${currentSong.name}]**`)
					.setDescription(`da skip ! ⏭⏭⏭`)
					.setThumbnail(currentSong.thumbnail)
					.setColor('#eb349e')
			]
		});
	}
}
