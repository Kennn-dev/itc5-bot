import type Aram from '@/models/aramQ';
import type { Player, Song } from 'discord-music-player';

declare module '@sapphire/pieces' {
	interface Container {
		player: Player;
		searchTracks?: Song[];
		queueAram: Aram;
		// currentChannel :
	}
}
