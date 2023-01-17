import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import type { Client } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	name: 'musicSongPlay'
})
export class MusicSongPlayListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
			event: 'addSong'
		});
	}
	public override async run(_client: Client): Promise<void> {
		const { player } = container;
		player.on('songAdd', (_queue, _song) => {
			console.log('song added ============================================');
		});
	}
}
