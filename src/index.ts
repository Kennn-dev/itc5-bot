import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { Player } from 'discord-music-player';
import { ActivityType, GatewayIntentBits, Partials } from 'discord.js';
import playerListenEvents from './lib/playerListenEvents';
import './lib/setup';
import Aram from './models/aramQ';

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
container.queueAram = new Aram();
playerListenEvents();
const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login(process.env.DISCORD_TOKEN);
		client.logger.info('logged in');

		if (client.user) {
			client.user.setPresence({
				activities: [{ name: `Ken is my Lord 👑`, type: ActivityType.Streaming, url: 'https://www.twitch.tv/im_kennnnn' }],
				status: 'online'
			});
		}
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
