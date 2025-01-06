import { Event } from "../entities/event";
import { STATUS } from "../../domain/enums/status_enum";
import { AGE_ENUM } from "../enums/age_enum";

export class EventMock {
  public events: Event[];

  constructor(initialEvents: Event[] = []) {
    this.events =
      initialEvents.length > 0
        ? initialEvents
        : [
            new Event({
              eventId: "1",
              name: "Galleria Night",
              description:
                "Galleria club. A melhor balada de São Paulo. Venha curtir com a gente!",
              location: {
                address: "123 Main St",
                number: 123,
                cep: "12345-678",
                city: "City",
                neighborhood: "Neighborhood",
                state: "State",
                latitude: 0,
                longitude: 0,
              },
              price: 1,
              ageRange: AGE_ENUM.ADOLESCENT,
              eventDate: new Date("2025-09-15"),
              instituteId: "1",
              eventStatus: STATUS.ACTIVE,
              bannerUrl: "https://example.com/galleria_night.jpg",
              ticketUrl: "https://example.com/galleria_night_tickets",
            }),
            new Event({
              eventId: "2",
              name: "Vila Mix Festival",
              description:
                "Vila Mix Festival. O maior festival de música sertaneja do Brasil.",
              location: {
                address: "123 Main St",
                number: 123,
                cep: "12345-678",
                city: "City",
                neighborhood: "Neighborhood",
                state: "State",
                latitude: 0,
                longitude: 0,
              },
              price: 1,
              ageRange: AGE_ENUM.ADOLESCENT,
              eventDate: new Date("2025-10-05"),
              instituteId: "2",
              eventStatus: STATUS.ACTIVE,
              bannerUrl: "https://example.com/vilamix_festival.jpg",
              ticketUrl: "https://example.com/vilamix_festival_tickets",
            }),
            new Event({
              eventId: "3",
              name: "Modular",
              description:
                "Modular. A melhor festa de música eletrônica de São Paulo.",
              location: {
                address: "123 Main St",
                number: 123,
                cep: "12345-678",
                city: "City",
                neighborhood: "Neighborhood",
                state: "State",
                latitude: 0,
                longitude: 0,
              },
              price: 1,
              ageRange: AGE_ENUM.ADOLESCENT,
              eventDate: new Date("2025-11-20"),
              instituteId: "3",
              eventStatus: STATUS.ACTIVE,
              bannerUrl: "https://example.com/modular_beats.jpg",
            }),
          ];
  }
}
