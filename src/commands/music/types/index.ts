import type { VoiceConnection } from '@discordjs/voice';
import type { Message } from 'discord.js';

export interface QueueOptions {
	connection: VoiceConnection;
	message: Message;
}
