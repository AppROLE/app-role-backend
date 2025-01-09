import { Profile } from 'src/shared/domain/entities/profile';
import { STATUS } from 'src/shared/domain/enums/status_enum';
import { ConfirmedEventsResponse } from './get_other_profile_usecase';

class ProfileViewmodel {
  userId: string;
  nickname: string;
  username: string;
  biography?: string;
  linkInstagram?: string;
  linkTiktok?: string;
  backgroundPhoto?: string;
  profilePhoto?: string;
  followers: number;
  following: number;

  constructor(profile: Profile) {
    this.userId = profile.userId;
    this.nickname = profile.nickname;
    this.username = profile.username;
    this.biography = profile.biography;
    this.linkInstagram = profile.linkInstagram;
    this.linkTiktok = profile.linkTiktok;
    this.backgroundPhoto = profile.backgroundPhoto;
    this.profilePhoto = profile.profilePhoto;
    this.followers = profile.followers.length;
    this.following = profile.following.length;
  }

  toJSON() {
    return {
      userId: this.userId,
      nickname: this.nickname,
      username: this.username,
      biography: this.biography,
      linkInstagram: this.linkInstagram,
      linkTiktok: this.linkTiktok,
      backgroundPhoto: this.backgroundPhoto,
      profilePhoto: this.profilePhoto,
      followers: this.followers,
      following: this.following,
    };
  }
}

class ConfirmedEventsViewmodel {
  eventId: string;
  eventName: string;
  instituteName: string;
  neighborhood: string;
  eventStatus: STATUS;
  eventPhoto: string;
  eventDate: number;

  constructor(event: ConfirmedEventsResponse) {
    this.eventId = event.eventId;
    this.eventName = event.eventName;
    this.instituteName = event.instituteName;
    this.neighborhood = event.neighborhood;
    this.eventStatus = event.eventStatus;
    this.eventPhoto = event.eventPhoto;
    this.eventDate = event.eventDate;
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventName: this.eventName,
      instituteName: this.instituteName,
      neighborhood: this.neighborhood,
      eventStatus: this.eventStatus,
      eventPhoto: this.eventPhoto,
      eventDate: this.eventDate,
    };
  }
}

export class GetOtherProfileViewmodel {
  private profile: ProfileViewmodel;
  private confirmedEvents: ConfirmedEventsViewmodel[];

  constructor(profile: Profile, confirmedEvents: ConfirmedEventsResponse[]) {
    this.profile = new ProfileViewmodel(profile);
    this.confirmedEvents = confirmedEvents.map(
      (event) => new ConfirmedEventsViewmodel(event)
    );
  }

  toJSON() {
    return {
      profile: this.profile.toJSON(),
      confirmedEvents: this.confirmedEvents.map((event) => event.toJSON()),
    };
  }
}
