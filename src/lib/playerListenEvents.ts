import { container } from '@sapphire/framework';
import { EmbedBuilder, VoiceChannel } from 'discord.js';
let embed = new EmbedBuilder().setColor('Random');
export default function () {
	container.player
		// Emitted when channel was empty.
		.on('channelEmpty', (_queue) => console.log(`Everyone left the Voice Channel, _queue ended.`))
		// Emitted when a song was added to the _queue.
		.on('songAdd', (_queue, song) => {
			const channel = _queue.guild.channels.cache.get('562357669063557282') as VoiceChannel;
			const em = embed
				.setTitle(`**[${song.name}]**`)
				.setAuthor({ name: song?.requestedBy?.username + '' })
				.setURL(song.url)
				.setDescription(`Da duoc them vao queue by **${song?.requestedBy?.username}**`)
				.setThumbnail(song.thumbnail)
				.setFooter({ text: `Thoi gian: ${song.duration}` })
				.setColor('#149dff');

			console.log('cannel', channel);
			channel.send({ embeds: [em] });
		})
		// Emitted when a playlist was added to the _queue.
		.on('playlistAdd', (_queue, playlist: any) => console.log(`Playlist ${playlist} with ${playlist?.songs.length} was added to the _queue.`))
		// Emitted when there was no more music to play.
		.on('queueDestroyed', (_queue) => console.log(`The _queue was destroyed.`))
		// Emitted when the _queue was destroyed (either by ending or stopping).
		.on('queueEnd', (_queue) => console.log(`The _queue has ended.`))
		// Emitted when a song changed.
		.on('songChanged', (_queue, newSong, _oldSong) => console.log(`${newSong} is now playing.`))
		// Emitted when a first song in the _queue started playing.
		.on('songFirst', (_queue, song) => console.log(`Started playing ${song}.`))
		// Emitted when someone disconnected the bot from the channel.
		.on('clientDisconnect', (_queue) => console.log(`I was kicked from the Voice Channel, _queue ended.`))
		// Emitted when deafenOnJoin is true and the bot was undeafened
		.on('clientUndeafen', (_queue) => console.log(`I got undefeanded.`))
		// Emitted when there was an error in runtime
		.on('error', (error, _queue) => {
			console.log(`Error: ${error} in ${_queue.guild.name}`);
		});
}
