import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { APIEmbed, EmbedType } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Confirm your team picked',
	name: 'done'
})
export class DoneCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder //
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((op) => op.setName('id').setDescription('Your id pool sent through dm 💌').setRequired(true)),
			{
				idHints: ['1167476183265464340']
			}
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		try {
			await interaction.deferReply();
			const idQueue = interaction.options.get('id')?.value;

			if (!idQueue) throw new Error('Id not valid');
			const userId = interaction.user.id;

			// interaction.followUp(`${userId} - ${idQueue}`);

			const q = this.container.queueAram.updateStatus(idQueue.toString(), userId);
			console.log(q);
			if (q.isTeamOneAccepted === true && q.isTeamTwoAccepted === true) {
				const embed = this.makePickBoard(q.teamOnePool!, q.teamTwoPool!);
				interaction.followUp({
					embeds: [embed]
				});

				this.container.queueAram.removeQueue(idQueue.toString());
				return;
			}

			if (q.isTeamOneAccepted) {
				interaction.followUp('Team 1 : Done ✅');
				return;
			}

			if (q.isTeamTwoAccepted) {
				interaction.followUp('Team 2 : Done ✅');
				return;
			}
		} catch (error) {
			if (error instanceof Error) {
				interaction.followUp(`Error : ${error.message.toString()}`);
			}
		}
	}

	private makePickBoard(teamOne: string[], teamTwo: string[]): APIEmbed {
		const embed: APIEmbed = {
			type: EmbedType.Rich,
			title: `ARAM Result`,
			description: '',
			color: 0xf92c77,
			fields: [
				{
					name: `👸 Team 1`,
					value: teamOne.join('\n '),
					inline: true
				},
				{
					name: `🤴 Team 2`,
					value: teamTwo.join('\n '),
					inline: true
				}
			],
			footer: {
				text: `Result complete !`
			}
		};

		return embed;
	}
}
