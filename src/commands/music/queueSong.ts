import { ChatInputCommand, Command, container } from '@sapphire/framework';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

export class UserCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName('queue').setDescription(' Xem queue 🚦'));
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		if (!interaction.guild) {
			await interaction.reply('Invalid guild 🤡');
			return;
		}
		const queue = container.player.getQueue(interaction.guild);
		// check if there are songs in the queue
		if (!queue || !queue.playing) {
			await interaction.reply('Het nhac !!! 🤡');
			return;
		}

		// Get the first 10 songs in the queue
		const queueString = queue.tracks
			.slice(0, 10)
			.map((song, i) => {
				return `${i === 0 ? '🟡' : '🔴'} ${i} - [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
			})
			.join('\n');

		// Get the current song
		const currentSong = queue.current;
		let embed = new EmbedBuilder();
		await interaction.reply({
			embeds: [
				embed
					.setAuthor({ name: interaction.user.username })
					.setDescription(
						`** 🟢 Dang choi**\n` +
							(currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : 'None') +
							`\n\n**Queue**\n${queueString}`
					)
					.setThumbnail(currentSong.thumbnail)
			]
		});
	}
}
