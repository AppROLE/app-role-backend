import { IEventRepository } from "src/shared/domain/irepositories/event_repository_interface";

export class GetAllConfirmedEventsUseCase {
    constructor(private readonly repo: IEventRepository) {}

    async execute(username: string, isMyEvents: boolean, myUsername: string){
        if(!username) throw new Error("Username is required");

        return this.repo.getAllConfirmedEvents(username, isMyEvents, myUsername);
    }
}