import { createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, CommandOptions } from '@sapphire/framework';
import axios from 'axios';
import { APIApplicationCommandOptionChoice, CommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';

@ApplyOptions<CommandOptions>({
	preconditions: ['GuildOnly', 'InVoiceChannelOnly']
})
export class SpeakCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		try {
			// console.log(container);
			await interaction.deferReply();
			// get query from user
			const query = interaction.options.get('query')?.value;
			const speaker = interaction.options.get('speaker')?.value || 1;
			// console.log(query);

			const res = await axios.post(
				'https://api.zalo.ai/v1/tts/synthesize',
				{
					input: query,
					speaker_id: +speaker
				},
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						apikey: process.env.ZALO_API_KEY
					}
				}
			);

			// Wait until you are connected to the channel
			const channel = (interaction.member as GuildMember)?.voice.channel;
			const source = await res.data.data.url;
			const player = createAudioPlayer();
			const resource = createAudioResource(source);
			// console.log(audio);
			if (channel?.id && channel.guild.id) {
				const connection = joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator
				});
				// console.log(connection);
				player.play(resource);
				connection.subscribe(player);
				await interaction.followUp({
					content: query + '',
					ephemeral: true
				});
			}
		} catch (error) {
			console.error(error);
			await interaction.followUp('Loi roi `🛑`');
		}
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		const options: APIApplicationCommandOptionChoice<string>[] = [
			{
				name: 'Girl giong Nam 👱‍♀️',
				value: '1'
			},
			{
				name: 'Girl giong Bac 👩‍🦰',
				value: '2'
			},
			{
				name: 'Boi giong Nam 🧒',
				value: '3'
			},
			{
				name: 'Boi giong Bac 👨‍🦰',
				value: '4'
			}
		];
		const builder = new SlashCommandBuilder();
		builder
			.setName('speak')
			.setDescription('Speak cai gi do')
			.addStringOption((v) => v.setName('query').setDescription('noi j do').setRequired(true))
			.addStringOption((v) =>
				v
					.setName('speaker')
					.setDescription('giong nguoi noi')
					.setChoices(...options)
			);
		registry.registerChatInputCommand(builder, {
			idHints: ['1070242004031778886']
		});
	}
}
