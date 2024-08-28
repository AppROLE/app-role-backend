import { Event } from "../entities/event";
import { STATUS } from "../../domain/enums/status_enum";

export class EventMock {
  public events: Event[];

  constructor() {
    this.events = [
      new Event({
        name: "Galleria Night",
        description:
          "Galleria club. A melhor balada de São Paulo. Venha curtir com a gente!",
        address: "987 Club St, Downtown",
        price: 80.0,
        ageRange: "21+",
        eventDate: new Date("2025-09-15"),
        districtId: "1",
        instituteId: "1",
        eventStatus: STATUS.ACTIVE,
        bannerUrl: "https://example.com/galleria_night.jpg",
      }),
      new Event({
        name: "Vila Mix Festival",
        description:
          "Vila Mix Festival. O maior festival de música sertaneja do Brasil.",
        address: "321 Mix Ave, City Center",
        price: 120.0,
        ageRange: "18+",
        eventDate: new Date("2025-10-05"),
        districtId: "2",
        instituteId: "2",
        eventStatus: STATUS.ACTIVE,
        bannerUrl: "https://example.com/vilamix_festival.jpg",
      }),
      new Event({
        name: "Modular",
        description:
          "Modular. A melhor festa de música eletrônica de São Paulo.",
        address: "258 Dance Ln, Old Town",
        price: 100.0,
        ageRange: "18+",
        eventDate: new Date("2025-11-20"),
        districtId: "3",
        instituteId: "3",
        eventStatus: STATUS.ACTIVE,
        bannerUrl: "https://example.com/modular_beats.jpg",
      }),
    ];
  }
}
