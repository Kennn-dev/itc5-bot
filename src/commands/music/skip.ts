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
		if (!interaction.guild) {
			await interaction.reply('Invalid guild 🤡');
			return;
		}

		const queue = await container.player.getQueue(interaction.guild);
		// If there is no queue, return
		if (!queue) {
			await interaction.reply('Khum co bai nao het ! 🤡');
			return;
		}
		const currentSong = queue.current;
		await queue?.skip();

		const tracks = queue.tracks;
		if (tracks.length > 0) {
			await queue.play();
		}

		// Return an embed to the user saying the song has been skipped
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`**[${currentSong.title}]**`)
					.setDescription(`da skip ! ⏭⏭⏭`)
					.setThumbnail(currentSong.thumbnail)
					.setColor('#eb349e')
			]
		});
	}
}
