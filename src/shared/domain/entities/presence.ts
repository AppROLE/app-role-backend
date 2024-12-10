import { EntityError } from "src/shared/helpers/errors/domain_errors";

interface PresenceProps {
  id?: string,
  eventId: string,
  username: string,
  nickname: string,
  profilePhoto?: string,
  promoterCode?: string,
  checkedInAt: Date
}

export class Presence {
  private _id?: string;
  private _eventId: string;
  private _username: string;
  private _nickname: string;
  private _profilePhoto?: string;
  private _promoterCode?: string;
  private _checkedInAt: Date;

  constructor(props: PresenceProps) {
    this._id = props.id
    this._eventId = props.eventId;
    if (!Presence.validateUsername(props.username)) {
      throw new EntityError('username');
    }
    this._username = props.username;
    if (props.profilePhoto && !Presence.validateProfilePhoto(props.profilePhoto)) {
      throw new EntityError('profilePhoto');
    }
    this._profilePhoto = props.profilePhoto;
    if (!Presence.validateNickname(props.nickname)) {
      throw new EntityError('nickname');
    }
    this._nickname = props.nickname;
    if (props.promoterCode && props.promoterCode.trim() === '') {
      throw new EntityError('promoterCode');
    }
    this._promoterCode = props.promoterCode;
    this._checkedInAt = props.checkedInAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get eventId() {
    return this._eventId;
  }

  set eventId(eventId: string) {
    this._eventId = eventId;
  }

  get username() {
    return this._username;
  }

  set username(username: string) {
    this._username = username;
  }

  get profilePhoto(): string | undefined {
    return this._profilePhoto;
  }

  set profilePhoto(profilePhoto: string) {
    this._profilePhoto = profilePhoto;
  }

  get nickname() {
    return this._nickname;
  }

  set nickname(nickname: string) {
    this._nickname = nickname;
  }

  get promoterCode(): string | undefined {
    return this._promoterCode
  }

  set promoterCode(promoterCode: string) {
    this._promoterCode = promoterCode;
  }

  get checkedInAt(): Date {
    return this._checkedInAt
  }

  set checkedInAt(checkedInAt: Date) {
    this._checkedInAt = checkedInAt;
  }

  static validateUsername(username: string): boolean {
    if (username.length < 3 || username.length > 20) {
      return false;
    }

    if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      return false;
    }

    return true;
  }

  static validateNickname(nickname: string): boolean {
    if (nickname.length < 3 || nickname.length > 20) {
      return false;
    }

    if (!/^[\p{L}\p{M}\p{N}_\- ]+$/u.test(nickname)) {
      return false;
    }

    return true;
  }

  static validateProfilePhoto(profilePhoto: string): boolean {
    if (profilePhoto.length < 3 || profilePhoto.length > 255) {
      return false;
    }

    return true;
  }

}