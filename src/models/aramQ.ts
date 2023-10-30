import type { AramQueue } from '@/types/aram';
import uniqid from 'uniqid';

export default class Aram {
	queue: AramQueue[] = [];
	constructor() {}

	get(queueId: string): AramQueue | undefined {
		return this.queue.find((v) => v.id === queueId);
	}

	updateStatus(qId: string, userId: string): AramQueue {
		const qIdx = this.queue.findIndex((v) => v.id === qId);
		if (qIdx === -1) throw new Error('Cannot find your queue 🎏');

		// if this player in team 1
		if (this.queue[qIdx].teamOne.findIndex((v) => v === userId) !== -1) {
			this.queue[qIdx].isTeamOneAccepted = true;
		}

		// if this player in team 2
		if (this.queue[qIdx].teamTwo.findIndex((v) => v === userId) !== -1) {
			this.queue[qIdx].isTeamTwoAccepted = true;
		}

		return this.queue[qIdx];
	}

	add(newQueue: AramQueue): string {
		newQueue.isTeamOneAccepted = false;
		newQueue.isTeamTwoAccepted = false;

		if (!newQueue.id) {
			newQueue.id = uniqid();
		}
		this.queue.push(newQueue);
		return newQueue.id;
	}

	accept(userId: string, id: string) {
		const qI = this.queue.findIndex((v) => v.id === id);
		if (!qI) throw new Error('Id is incorrect');

		const indexTeamOne = this.queue[qI].teamOne.findIndex((v) => v === userId);

		// if this player in team one , accept
		if (indexTeamOne !== -1) {
			this.queue[qI].isTeamOneAccepted = true;
		}

		const indexTeamTwo = this.queue[qI].teamTwo.findIndex((v) => v === userId);

		// if this player in team two , accept
		if (indexTeamTwo !== -1) {
			this.queue[qI].isTeamTwoAccepted = true;
		}
	}

	removeQueue(qId: string) {
		this.queue = this.queue.filter((v) => v.id !== qId);
	}
}
