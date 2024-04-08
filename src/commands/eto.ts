import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import Canvas from 'canvas';
import type { CommandInteraction } from 'discord.js';
import GIFEncoder from 'gifencoder';
import path from 'path';

@ApplyOptions<Command.Options>({
	description: 'Generate a gif',
	name: 'gifmaker'
})
export class GifMakerCommand extends Command {
	FRAME = 8;
	defaultOptions = {
		resolution: 128,
		delay: 50,
		backgroundColor: null
	};
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder //
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((op) => op.setName('user').setDescription('Your user want to make gif').setRequired(true)),
			{
				idHints: ['123123']
			}
		);
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		try {
			await interaction.deferReply();
			const avatar = interaction.options.get('user');
			const avatarUrl = `https://cdn.discordapp.com/avatars/${avatar!.user!.id}/${avatar?.user?.avatar}.png`;

			const buffer = await this.makeGif(avatarUrl);

			interaction.followUp({
				files: [
					{
						attachment: buffer,
						name: 'eto.gif'
					}
				]
			});
		} catch (error) {
			if (error instanceof Error) {
				interaction.followUp(`Error : ${error.message.toString()}`);
			}
		}
	}

	private async makeGif(avatarUrl: string) {
		console.log(avatarUrl);
		const avatar = await Canvas.loadImage(avatarUrl);
		//  init Gifd
		const encoder = new GIFEncoder(this.defaultOptions.resolution, this.defaultOptions.resolution);
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(this.defaultOptions.delay);
		encoder.setTransparent('');

		// create canvas
		const _canvas = Canvas.createCanvas(this.defaultOptions.resolution, this.defaultOptions.resolution);
		const ctx: any = _canvas.getContext('2d');
		for (let index = 0; index < this.FRAME - 1; index++) {
			let i = index;
			if (index > 3) {
				// 8 - 4 -1
				i = this.FRAME - 1 - index;
			}

			ctx.drawImage(avatar, 0, 0, this.defaultOptions.resolution, this.defaultOptions.resolution);
			const img = await Canvas.loadImage(path.resolve(__dirname, `../assets/eto-${i}.gif`));
			ctx.drawImage(img, 0, 0, this.defaultOptions.resolution, this.defaultOptions.resolution);
			encoder.addFrame(ctx);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
		encoder.finish();
		const buffer = encoder.out.getData();
		// debug
		// fs.writeFile(path.join(__dirname, '../assets', 'result.gif'), buffer, (_error) => {
		// 	// Render gif
		// 	console.log('Done!');
		// });
		return buffer;
	}
}
