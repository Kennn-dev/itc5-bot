import { container } from '@sapphire/framework';
import { Player } from 'discord-player';

container.player = new Player(container.client, {
	ytdlOptions: {
		filter: 'audioonly',
		quality: 'highestaudio',
		highWaterMark: 1 << 25
	}
});

console.log('container', container.player); // value

declare module '@sapphire/pieces' {
	interface Container {
		player: Player;
	}
}
