export interface AramQueue {
	id?: string;
	teamOne: string[]; //ids
	teamTwo: string[]; //ids
	isTeamOneAccepted?: boolean;
	isTeamTwoAccepted?: boolean;
	teamOnePool?: string[];
	teamTwoPool?: string[];
}
