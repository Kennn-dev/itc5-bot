export interface TiktokVideo {
	aweme_id: string;
	video_id: string;
	region: string;
	title: string;
	cover: string;
	origin_cover: string;
	duration: number;
	play: string;
	wmplay: string;
	music: string;
	music_info: string;
	play_count: string;
	digg_count: string;
	comment_count: string;
	share_count: string;
	download_count: string;
	create_time: string;
	author: {
		id: string;
		unique_id: string;
		nickname: string;
		avatar: string;
	};
}
