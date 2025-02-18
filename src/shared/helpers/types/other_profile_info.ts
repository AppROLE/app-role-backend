import { FOLLOW_STATUS } from 'src/shared/domain/enums/follow_status';

export type OtherProfileInfo = {
  userId: string;
  name: string;
  nickname: string;
  username: string;
  biography?: string;
  followersLength: number;
  followingLength: number;
  linkInstagram?: string;
  linkTiktok?: string;
  backgroundPhoto?: string;
  profilePhoto?: string;
  followStatus: FOLLOW_STATUS;
  isPrivate: boolean;
};
