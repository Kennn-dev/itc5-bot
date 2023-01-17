import type { Player, Song } from 'discord-music-player';
declare module '@sapphire/pieces' {
	interface Container {
		player: Player;
		searchTracks?: Song[];
		// currentChannel :
	}
}
