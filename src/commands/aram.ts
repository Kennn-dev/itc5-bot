import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, container } from '@sapphire/framework';
import { APIEmbed, CommandInteraction, EmbedType } from 'discord.js';
import { Random } from 'random-js';
interface Pool {
	team1: string[];
	team2: string[];
}
@ApplyOptions<Command.Options>({
	description: 'A basic slash command'
})
export class AramCommand extends Command {
	r = new Random();
	fields1: string[] = [1, 2, 3, 4, 5].map((v) => `player${v}`);
	fields2: string[] = [1, 2, 3, 4, 5].map((v) => `player${v}_2`);
	champions = {};
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
		this.getChampionList();
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName('aram')
					.setDescription('Start generate a aram pools')
					.addUserOption((z) => z.setName('player1').setDescription('Player 1 - Team 1').setRequired(true))
					.addUserOption((z) => z.setName('player2').setDescription('Player 2 - Team 1').setRequired(true))
					.addUserOption((z) => z.setName('player3').setDescription('Player 3 - Team 1').setRequired(true))
					.addUserOption((z) => z.setName('player4').setDescription('Player 4 - Team 1').setRequired(true))
					.addUserOption((z) => z.setName('player5').setDescription('Player 5 - Team 1').setRequired(true))
					.addUserOption((z) => z.setName('player1_2').setDescription('Player 1 - Team 2').setRequired(true))
					.addUserOption((z) => z.setName('player2_2').setDescription('Player 2 - Team 2').setRequired(true))
					.addUserOption((z) => z.setName('player3_2').setDescription('Player 3 - Team 2').setRequired(true))
					.addUserOption((z) => z.setName('player4_2').setDescription('Player 4 - Team 2').setRequired(true))
					.addUserOption((z) => z.setName('player5_2').setDescription('Player 5 - Team 2').setRequired(true)),

			{
				idHints: ['1166742375188668456']
			}
		);
	}

	// slash command
	public override async chatInputRun(interaction: CommandInteraction) {
		try {
			await interaction.deferReply();
			const membersIds: string[] = this.getAllMembers(interaction);
			const team1Mem = membersIds.slice(0, 5);
			const team2Mem = membersIds.slice(5);
			const { team1, team2 } = this.generatePools();
			const id = container.queueAram.add({
				teamOne: team1Mem,
				teamTwo: team2Mem,
				teamOnePool: team1,
				teamTwoPool: team2
			});

			await this.sendToMembers(team1Mem, id, this.formatedMessage(team1), interaction);
			await this.sendToMembers(team2Mem, id, this.formatedMessage(team2), interaction);
			interaction.followUp('Pools sent for all players !');
		} catch (error) {
			if (error instanceof Error) {
				interaction.followUp(`Error : ${error.message.toString()}`);
			}
		}
	}
	private async sendToMembers(memberIds: string[], qId: string, message: string, interaction: CommandInteraction): Promise<any[]> {
		return Promise.all(
			memberIds.map(async (id) => {
				const embed: APIEmbed = {
					type: EmbedType.Rich,
					title: `Your team pool id : ${qId} `,
					description: message,
					color: 0x00dae1,
					image: {
						url: `https://images.prismic.io/play-vs/6c423286e877921fb6659122b16e1845df833e1f_league-of-legends-hero-splash.jpg?auto=compress,format`,
						proxy_url: `https://images.prismic.io/play-vs/6c423286e877921fb6659122b16e1845df833e1f_league-of-legends-hero-splash.jpg?auto=compress,format`
					}
				};

				await interaction.client.users.send(id, {
					embeds: [embed]
				});
			})
		);
	}
	private formatedMessage(arr: string[]) {
		return `Your team champions : ${arr.join(' , ')}`;
	}

	private getAllMembers(interaction: CommandInteraction): string[] {
		const result: any[] = [];
		this.fields1.forEach((name) => {
			const value = interaction.options.get(name);
			result.push(value?.value);
		});
		this.fields2.forEach((name) => {
			const value = interaction.options.get(name);
			result.push(value?.value);
		});

		// check duplicated value
		if (new Set(result).size !== result.length) {
			throw new Error('Duplicate player');
		}

		return result;
	}

	// Each pool of each teams has 10 champ ( 1 reroll each people ) => 2 teams = 20 champs
	private generatePools(): Pool {
		const championNames = this.getNames();
		const team1 = [];
		const team2 = [];
		this.r.pick(championNames);

		for (let index = 1; index <= 20; index++) {
			const champ = this.r.pick(championNames);
			const idx = championNames.findIndex((v) => v === champ);
			if (idx !== -1) {
				// Remove item from list
				championNames.splice(idx, 1);

				if (index % 2 == 0) {
					team1.push(champ);
				} else {
					team2.push(champ);
				}
			}
		}

		return {
			team1,
			team2
		};
	}

	private getNames(): string[] {
		let champions: string[] = [];
		for (const [_key, value] of Object.entries<{ id: string; key: string; name: string }>(this.champions)) {
			champions.push(value.name);
		}

		return champions;
	}

	private async getChampionList() {
		const versions = await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json();
		const lastedVersion = versions[0];

		const req = await (await fetch(`http://ddragon.leagueoflegends.com/cdn/${lastedVersion}/data/vi_VN/champion.json`)).json();
		// console.log(data);
		if (req.data) {
			this.champions = req.data;
		}
	}
}
