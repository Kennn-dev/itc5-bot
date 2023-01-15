import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, GuildMember, Message } from 'discord.js';

export class OwnerOnlyPrecondition extends Precondition {
	public override async messageRun(message: Message) {
		const isInVoice = !!message.member?.voice.channel;

		// for message command
		if (isInVoice) {
			return this.ok();
		}

		return this.error({
			message: 'U must in voice channel moi co the su dung command nay 🤗'
		});
	}

	public override async chatInputRun(interaction: CommandInteraction) {
		const voiceChannel = (interaction.member as GuildMember).voice.channelId;
		// console.log({ voiceChannel });

		// for message command
		if (voiceChannel) {
			return this.ok();
		}

		return this.error({
			message: 'U must in voice channel moi co the su dung command nay 🤗'
		});
	}

	//   public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
	//     // for Context Menu Command
	//     return this.checkOwner(interaction.user.id);
	//   }
}

declare module '@sapphire/framework' {
	interface Preconditions {
		InVoiceChannelOnly: never;
	}
}
