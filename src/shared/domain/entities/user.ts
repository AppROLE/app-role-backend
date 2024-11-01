import { EntityError } from "../../helpers/errors/domain_errors";
import { PRIVACY_TYPE } from "../enums/privacy_enum";
import { ROLE_TYPE } from "../enums/role_type";

interface UserProps {
  user_id?: string;
  name: string;
  nickname: string;
  username: string;
  email: string;
  biography?: string;
  roleType?: ROLE_TYPE;
  phoneNumber?: string;
  password?: string;
  createdAt?: Date;
  linkInstagram?: string;
  linkTiktok?: string;
  bgPhoto?: string;
  profilePhoto?: string;
  privacy?: PRIVACY_TYPE;
  following?: FollowingProps[];
  favorites?: FavoriteProps[];
}

export interface FollowingProps {
  userFollowedId: string;
  followedAt?: Date;
}

export interface FavoriteProps {
  instituteId: string;
  favoritedAt?: Date;
}

export class User {
  private user_id?: string;
  private name: string;
  private nickname?: string;
  private username: string;
  private email: string;
  private biography?: string;
  private roleType?: ROLE_TYPE;
  private phoneNumber?: string;
  private password?: string;
  private link_instagram?: string;
  private link_tiktok?: string;
  private bg_photo?: string;
  private profile_photo?: string;
  private privacy?: PRIVACY_TYPE;
  private created_at: Date;
  private following: FollowingProps[];
  private favorites: FavoriteProps[];

  constructor(props: UserProps) {
    this.user_id = props.user_id;
    if (!User.validateName(props.name)) {
      throw new EntityError("name");
    }
    this.name = props.name;
    if (!User.validateNickname(props.nickname)) {
      throw new EntityError("nickname");
    }
    if (!props.nickname) {
      props.nickname = props.name;
    } else {
      this.nickname = props.nickname;
    }
    if (!User.validateUsername(props.username)) {
      throw new EntityError("username");
    }
    this.username = props.username;
    if (!User.validateEmail(props.email)) {
      throw new EntityError("email");
    }
    this.email = props.email;
    if (!props.roleType) {
      this.roleType = ROLE_TYPE.COMMON;
    } else {
      if (!User.validateRoleType(props.roleType)) {
        throw new EntityError("roleType");
      }
      this.roleType = props.roleType;
    }
    if (props.password && !User.validatePassword(props.password)) {
      throw new EntityError("password");
    }
    this.password = props.password;
    if (props.linkInstagram && !User.validateInstagram(props.linkInstagram)) {
      throw new EntityError("linkInstagram");
    }
    this.link_instagram = props.linkInstagram;
    if (props.linkTiktok && !User.validateTiktok(props.linkTiktok)) {
      throw new EntityError("linkTiktok");
    }
    this.link_tiktok = props.linkTiktok;
    if (props.biography && !User.validateBiography(props.biography)) {
      throw new EntityError("biography");
    }
    this.biography = props.biography;
    if (props.bgPhoto && !User.validateBgPhoto(props.bgPhoto)) {
      throw new EntityError("bgPhoto");
    }
    this.bg_photo = props.bgPhoto;
    if (props.profilePhoto && !User.validateProfilePhoto(props.profilePhoto)) {
      throw new EntityError("profilePhoto");
    }
    this.profile_photo = props.profilePhoto;

    if (!props.privacy) {
      this.privacy = PRIVACY_TYPE.PUBLIC;
    } else {
      if (!User.validatePrivacy(props.privacy)) {
        throw new EntityError("privacy");
      }
      this.privacy = props.privacy;
    }

    this.following = props.following || [];
    this.favorites = props.favorites || [];
    this.created_at = props.createdAt || new Date();
  }

  get userId(): string | undefined {
    return this.user_id;
  }

  get userName(): string {
    return this.name;
  }

  get userNickname(): string | undefined {
    return this.nickname;
  }

  get userUsername(): string {
    return this.username;
  }

  get userEmail(): string {
    return this.email;
  }

  get userRoleType(): ROLE_TYPE | undefined {
    return this.roleType;
  }

  get userPhoneNumber(): string | undefined {
    return this.phoneNumber;
  }

  get userBiography(): string | undefined {
    return this.biography;
  }

  get userPassword(): string | undefined {
    return this.password;
  }

  get userCreatedAt(): Date {
    return this.created_at;
  }

  get userlinkInstagram(): string | undefined {
    return this.link_instagram;
  }

  get userlinkTiktok(): string | undefined {
    return this.link_tiktok;
  }

  get userBgPhoto(): string | undefined {
    return this.bg_photo;
  }

  get userProfilePhoto(): string | undefined {
    return this.profile_photo;
  }

  get userPrivacy(): PRIVACY_TYPE | undefined {
    return this.privacy;
  }

  get userFollowing(): FollowingProps[] {
    return this.following;
  }

  get userFavorites(): FavoriteProps[] {
    return this.favorites;
  }

  set setUserId(id: string | undefined) {
    this.user_id = id;
  }

  set setUserName(name: string) {
    this.name = name;
  }

  set setUserNickname(nickname: string) {
    this.nickname = nickname;
  }

  set setUserUsername(username: string) {
    this.username = username;
  }

  set setUserEmail(email: string) {
    this.email = email;
  }

  set setUserRoleType(roleType: ROLE_TYPE | undefined) {
    this.roleType = roleType;
  }

  set setUserPhoneNumber(phoneNumber: string | undefined) {
    this.phoneNumber = phoneNumber;
  }

  set setUserBiography(biography: string | undefined) {
    this.biography = biography;
  }

  set setUserCreatedAt(createdAt: Date) {
    this.created_at = createdAt;
  }

  set setUserlinkInstagram(linkInstagram: string | undefined) {
    this.link_instagram = linkInstagram;
  }

  set setUserlinkTiktok(linkTiktok: string | undefined) {
    this.link_tiktok = linkTiktok;
  }

  set setUserBgPhoto(bgPhoto: string | undefined) {
    this.bg_photo = bgPhoto;
  }

  set setUserProfilePhoto(profilePhoto: string | undefined) {
    this.profile_photo = profilePhoto;
  }

  set setUserPrivacy(privacy: PRIVACY_TYPE | undefined) {
    this.privacy = privacy;
  }

  set setUserFollowing(following: FollowingProps[]) {
    this.following = following;
  }

  set setUserFavorites(favorites: FavoriteProps[]) {
    this.favorites = favorites;
  }

  set setUserPassword(password: string | undefined) {
    this.password = password;
  }

  static validateName(name: string): boolean {
    if (!name || name.trim().length === 0 || name.trim().length > 100) {
      return false;
    }
    return true;
  }

  static validateNickname(nickname: string): boolean {
    if (nickname && nickname.trim().length > 50) {
      return false;
    }
    return true;
  }

  static validateUsername(username: string): boolean {
    if (
      !username ||
      username.trim().length === 0 ||
      username.trim().length > 50 ||
      username !== username.toLowerCase()
    ) {
      return false;
    }
    return true;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return false;
    }
    return true;
  }

  static validateRoleType(roleType?: ROLE_TYPE): boolean {
    if (roleType && !Object.values(ROLE_TYPE).includes(roleType)) {
      return false;
    }

    return true;
  }

  static validateBiography(biography?: string): boolean {
    if (biography && biography.trim().length > 1000) {
      return false;
    }
    if (biography && biography.trim().length === 0) {
      return false;
    }

    return true;
  }

  static validatePhoneNumber(phoneNumber?: string): boolean {
    if (phoneNumber && phoneNumber.trim().length > 20) {
      return false;
    }

    return true;
  }

  // minimum 1 upper, 1 lower, 1 number, 1 special character, min 6 characters
  static validatePassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&ç~{}#%&()\\`])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password || !passwordRegex.test(password)) {
      return false;
    }
    return true;
  }

  static validateInstagram(linkInstagram?: string): boolean {
    if (linkInstagram && linkInstagram.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validateTiktok(linkTiktok?: string): boolean {
    if (linkTiktok && linkTiktok.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validateBgPhoto(bgPhoto?: string): boolean {
    if (bgPhoto && bgPhoto.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validateProfilePhoto(profilePhoto?: string): boolean {
    if (profilePhoto && profilePhoto.trim().length > 255) {
      return false;
    }

    return true;
  }

  static validatePrivacy(privacy?: PRIVACY_TYPE): boolean {
    if (!privacy || !Object.values(PRIVACY_TYPE).includes(privacy)) {
      return false;
    }

    return true;
  }

  static validateFollowing(following?: FollowingProps[]): boolean {
    if (following && !Array.isArray(following)) {
      return false;
    }
    following?.forEach((f) => {
      if (!f.userFollowedId || f.userFollowedId.trim().length === 0) {
        return false;
      }
    });

    return true;
  }

  static validateFavorites(favorites?: FavoriteProps[]): boolean {
    if (favorites && !Array.isArray(favorites)) {
      return false;
    }
    favorites?.forEach((f) => {
      if (!f.instituteId || f.instituteId.trim().length === 0) {
        return false;
      }
    });
    return true;
  }
}
