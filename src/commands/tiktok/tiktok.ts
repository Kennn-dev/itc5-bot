import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions } from '@sapphire/framework';
import axios from 'axios';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import type { TiktokVideo } from './types';

@ApplyOptions<CommandOptions>({
	preconditions: ['GuildOnly']
})
export class TiktokCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		try {
			// console.log(container);
			await interaction.deferReply();
			// get query from user
			// const query = interaction.options.get('query')?.value;

			let embed = new EmbedBuilder();

			const options = {
				method: 'GET',
				url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/feed/list',
				params: { region: 'VN', count: '1' },
				headers: {
					'X-RapidAPI-Key': 'ca1a5fdda6mshf8ce50808ef877fp18d2a6jsn90d701ac0834',
					'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
				}
			};

			axios
				.request(options)
				.then(function (response) {
					// console.log(response);
					const vid: TiktokVideo = response.data.data[0];
					// console.log(vid);
					embed.setTitle(vid.title).setAuthor({ name: vid.author?.nickname, iconURL: vid.author?.avatar }).setColor('Random');

					interaction.followUp({
						embeds: [embed]
					});

					// const videomp4 = new AttachmentBuilder()
					interaction.channel?.send(vid.wmplay);
				})
				.catch(function (error) {
					console.error(error);
				});
		} catch (error) {
			console.error(error);
			return;
		}
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) => builder.setName('tiktok').setDescription('Luot toptop 🐸'),
			// .addStringOption((op) => op.setName('query').setDescription('song url or name').setRequired(true))
			{
				idHints: ['1070034448923504671']
			}
		);
	}
}
