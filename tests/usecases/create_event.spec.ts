import { describe, it, expect } from "vitest";
import { Event } from "../../src/shared/domain/entities/event";
import { STATUS } from "../../src/shared/domain/enums/status_enum";
import { IEventRepository } from "../../src/shared/domain/irepositories/event_repository_interface";
import { CreateEventUseCase } from "../../src/modules/create_event/app/create_event_usecase";
import { EventRepositoryMock } from "../../src/shared/infra/mocks/event_repository_mock";

describe("CreateEventUseCase", () => {
  it("should create and save an event", async () => {
    const mockRepo: IEventRepository = new EventRepositoryMock();
    const usecase = new CreateEventUseCase(mockRepo);

    const params = {
      name: "Galleria Night",
      description:
        "Galleria club. A melhor balada de São Paulo. Venha curtir com a gente!",
      address: "987 Club St, Downtown",
      price: 2,
      ageRange: "18-20",
      eventDate: new Date("2025-09-15"),
      instituteId: "1",
      eventStatus: STATUS.ACTIVE,
      bannerUrl: "https://example.com/galleria_night.jpg",
      ticketUrl: "https://example.com/vilamix_festival_tickets",
    };

    const result = await usecase.execute(params);
    console.log("RESULTADO: ", result);
    // console.log("CARALHO" + typeof result);
    // console.log(result instanceof Event);
    // console.log("Result type:", result.constructor.name);
    // console.log("FILHA DA PUTA DE url " + result.bannerUrl);

    // expect(result.name).toBe("Galleria Night");
    // expect(result.description).toBe(
    //   "Galleria club. A melhor balada de São Paulo. Venha curtir com a gente!"
    // );
    // expect(result.address).toBe("987 Club St, Downtown");
    // expect(result.price).toBe(2);
    // expect(result.ageRange).toBe("18-20");
    // expect(result.eventDate).toEqual(new Date("2025-09-15"));
    // expect(result.instituteId).toBe("1");
    // expect(result.eventStatus).toBe(STATUS.ACTIVE);
    // expect(result.bannerUrl).toBe("https://example.com/galleria_night.jpg");

    // expect(result.ticketUrl).toBe("https://example.com/vilamix_festival_tickets");

    const events = await mockRepo.getAllEvents();
    expect(events).toHaveLength(3);
  });
});
