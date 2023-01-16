import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerOptions, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { StringSelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandlerOptions>({
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
		console.log(interaction);
		if (interaction.customId !== 'SELECT_SONG') return this.none();

		return this.some();
	}

	public async run(interaction: StringSelectMenuInteraction) {
		await interaction.reply({
			// Remember how we can have multiple values? Let's get the first one!
			content: `You selected: ${interaction.values[0]}`
		});
	}
}
