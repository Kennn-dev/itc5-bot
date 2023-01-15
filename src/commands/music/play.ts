import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, container } from '@sapphire/framework';
import type { CommandInteraction, GuildChannelResolvable, GuildMember } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<CommandOptions>({
	preconditions: ['GuildOnly', 'InVoiceChannelOnly']
})
export class PlayCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		// console.log(container);

		// get query from user
		const query = interaction.options.get('query')?.value;

		if (!query) {
			return interaction.reply('Invalid query');
		}

		if (!interaction.guild) {
			return interaction.reply('Invalid guild');
		}

		let queue = container.player.getQueue(interaction.guild);
		if (!queue) {
			// Create a play queue for the server if not have
			queue = container.player.createQueue(interaction.guild);
		}

		// Wait until you are connected to the channel
		const channel = (interaction.member as GuildMember).voice.channel;
		if (!queue.connection) await queue.connect(channel as GuildChannelResolvable);

		const result = await container.player.search(query?.toString(), {
			requestedBy: interaction.user
		});

		if (result.tracks.length === 0) {
			return interaction.reply(`Hok co ket wa -- ${query}`);
		}

		// console.log(result);
		let embed = new EmbedBuilder();

		// Add the tracks to the queue
		// const playlist = result.playlist;
		const tracks = result.tracks;

		// TRACK TYPE
		if (tracks.length === 0) {
			return interaction.reply('Khum tim thay bai nao 🤡');
		}

		// Add the track to the queue
		const song = result.tracks[0];
		queue.addTrack(song);
		embed
			.setTitle(`**[${song.title}]**`)
			.setAuthor({ name: song.requestedBy.username })
			.setURL(song.url)
			.setDescription(`Da duoc them vao queue by **${song.requestedBy.username}**`)
			.setThumbnail(song.thumbnail)
			.setFooter({ text: `Thoi gian: ${song.duration}` })
			.setColor('#149dff');

		// PLAYLIST TYPE IMPLEMENT HERE

		console.log(queue);

		// Play the song
		if (!queue.playing) await queue.play();
		// Respond with the embed containing information about the player
		return await interaction.reply({
			embeds: [embed]
		});
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName('play')
				.setDescription('Play 1 bai nhac ? Yah sure 🎶')
				.addStringOption((op) => op.setName('query').setDescription('song url or name').setRequired(true))
		);
	}
}
