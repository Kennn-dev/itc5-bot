import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions, container } from '@sapphire/framework';
import { Utils } from 'discord-music-player';
import { ActionRowBuilder, CommandInteraction, GuildChannelResolvable, GuildMember, StringSelectMenuBuilder } from 'discord.js';

@ApplyOptions<CommandOptions>({
	preconditions: ['GuildOnly', 'InVoiceChannelOnly']
})
export class PlayCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		// console.log(container);
		await interaction.deferReply();
		// get query from user
		const query = interaction.options.get('query')?.value;

		if (!query) {
			return interaction.reply('Invalid query');
		}

		if (!interaction.guildId) {
			return interaction.reply('Invalid guild');
		}

		let queue = await container.player.getQueue(interaction.guildId);
		console.log('==============	QUEUE');
		// console.log(queue);

		if (!queue) {
			// Create a play queue for the server if not have
			queue = await container.player.createQueue(interaction.guildId);
		}

		// Wait until you are connected to the channel
		const channel = (interaction.member as GuildMember).voice.channel;
		if (!queue.connection) await queue.join(channel as GuildChannelResolvable);

		// const result = await container.player.search(query?.toString(), {
		// 	requestedBy: interaction.user
		// });

		// await interaction.editReply(`Dang tim kiem tinh iu :FeelsBadMan: ...`);
		const result = await Utils.search(
			query?.toString(),
			{
				requestedBy: interaction.user
			},
			queue,
			5
		);
		// console.log(result);

		if (result.length === 0) {
			return interaction.reply(`Hok co ket wa -- ${query}`);
		}

		// console.log(result);

		// Add the tracks to the queue
		// const playlist = result.playlist;
		const tracks = result;

		// TRACK TYPE
		if (tracks.length === 0) {
			return interaction.reply('Khum tim thay bai nao 🤡');
		}

		container.searchTracks = tracks;
		const options: any = tracks.map((v) => ({
			label: v.name,
			value: v.toString()
		}));

		const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder().setCustomId('SELECT_SONG').setOptions(options)
		);
		console.log(options);
		await interaction.editReply({
			content: `Select a song 🤡`,
			components: [row]
		});
		return;
		// Add the track to the queue
		// const song = result.tracks[0];
		// await queue.addTrack(song);

		// PLAYLIST TYPE IMPLEMENT HERE

		// console.log(queue);

		// Play the song
		// if (!queue.playing) await queue.play();
		// Respond with the embed containing information about the player

		// let embed = new EmbedBuilder();
		// embed
		// 	.setTitle(`**[${song.title}]**`)
		// 	.setAuthor({ name: song.requestedBy.username })
		// 	.setURL(song.url)
		// 	.setDescription(`Da duoc them vao queue by **${song.requestedBy.username}**`)
		// 	.setThumbnail(song.thumbnail)
		// 	.setFooter({ text: `Thoi gian: ${song.duration}` })
		// 	.setColor('#149dff');

		// return await interaction.reply({
		// 	embeds: [embed]
		// });
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName('play')
					.setDescription('Play 1 bai nhac ? Yah sure 🎶')
					.addStringOption((op) => op.setName('query').setDescription('song url or name').setRequired(true)),
			{
				idHints: ['1064163584256520213']
			}
		);
	}
}
