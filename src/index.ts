import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { Player } from 'discord-music-player';
import { GatewayIntentBits, Partials } from 'discord.js';
import playerListenEvents from './lib/playerListenEvents';
import './lib/setup';

const client = new SapphireClient({
	defaultPrefix: 'c5',
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true
});

container.player = new Player(client, {
	leaveOnStop: false,
	quality: 'high',
	volume: 60,
	leaveOnEnd: false,
	leaveOnEmpty: false,
	ytdlRequestOptions: {
		filter: 'audioonly',
		quality: 'highestaudio',
		highWaterMark: 1 << 25
	}
});
container.searchTracks = undefined;
playerListenEvents();
// const player =);
// // add the trackStart event so when a song will be played this message will be sent
// player.on('trackStart', (queue: any, track) => {
// 	if (queue.metadata) {
// 		queue.metadata?.channel.send(`🎶 | Now playing **${track.title}**!`);
// 	}
// });

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
