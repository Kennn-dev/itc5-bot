import { ApplyOptions } from '@sapphire/decorators';
import { container, InteractionHandler, InteractionHandlerOptions, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { StringSelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandlerOptions>({
	enabled: true,
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class MenuHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.SelectMenu
		});
	}

	public override parse(interaction: StringSelectMenuInteraction) {
		if (interaction.customId !== 'SELECT_SONG') return this.none();

		return this.some();
	}

	public override async run(interaction: StringSelectMenuInteraction<any>) {
		const fil = (s: string): string => s.substring(0, 90);
		const songItem = fil(interaction.values[0]);

		// console.log('Songs 111', songItem);
		if (!songItem) {
			return interaction.reply(`Loi link !!! 🥵`);
		}

		if (!interaction.guildId) {
			return interaction.reply('Invalid guild');
		}
		let queue = await container.player.getQueue(interaction.guildId);
		if (!queue) {
			// create q
			queue = await container.player.createQueue(interaction.guildId);
		}
		// console.log(container.searchTracks);
		if (!container.searchTracks || container.searchTracks.length === 0) {
			return interaction.reply('Loi tracks');
		}
		// const channel = interaction.channel;
		// console.log(channel);
		// Play the song
		const song = container.searchTracks?.find((v) => v.toString() === songItem);

		// console.log(container.searchTracks);
		if (!song) {
			return interaction.reply('Loi song ');
		}
		// await queue.(song);
		await queue.play(song);

		// Respond with the embed containing information about the player
		// let embed = new EmbedBuilder();
		// embed
		// 	.setTitle(`**[${song.name}]**`)
		// 	.setAuthor({ name: song?.requestedBy?.username + '' })
		// 	.setURL(song.url)
		// 	.setDescription(`Da duoc them vao queue by **${song?.requestedBy?.username}**`)
		// 	.setThumbnail(song.thumbnail)
		// 	.setFooter({ text: `Thoi gian: ${song.duration}` })
		// 	.setColor('#149dff');

		// Clear searched tracks
		container.searchTracks = undefined;
		await interaction.reply({
			content: 'Song selected'
		});
		return;
	}
}
