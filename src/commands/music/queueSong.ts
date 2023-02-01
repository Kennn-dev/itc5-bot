import { ChatInputCommand, Command, container } from '@sapphire/framework';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

export class UserCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName('queue').setDescription(' Xem queue 🚦'), {
			idHints: ['1064261314337316936']
		});
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		// await interaction.deferReply();
		if (!interaction.guildId) {
			await interaction.reply('Invalid guildId 🤡');
			return;
		}
		const queue = container.player.getQueue(interaction.guildId);
		// check if there are songs in the queue
		if (!queue || !queue.isPlaying) {
			await interaction.reply('Het nhac !!! 🤡');
			return;
		}
		// Get the first 10 songs in the queue
		const queueString = queue.songs
			.slice(1, 10)
			.map((song, i) => {
				return ` \` ${i === 0 ? '🟡' : '🔴'} ${i + 1} \` - [${song.duration}] ${song.name} - <@${song?.requestedBy?.id}>`;
			})
			.join('\n');

		// Get the current song
		const currentSong = queue.nowPlaying;
		if (!currentSong) {
			return interaction.reply(`No song playin`);
		}
		let embed = new EmbedBuilder();
		console.log('done');
		await interaction.reply({
			embeds: [
				embed
					.setAuthor({ name: interaction.user.username })
					.setColor('#7d34eb')
					.setDescription(
						`** 🟢 Dang choi**\n` +
							(currentSong ? `\`[${currentSong.duration}]\` ${currentSong.name} - <@${currentSong?.requestedBy?.id}>` : 'None') +
							`\n\n**Queue**\n${queueString}`
					)
					.setThumbnail(currentSong.thumbnail)
			]
		});
		return;
	}
}
