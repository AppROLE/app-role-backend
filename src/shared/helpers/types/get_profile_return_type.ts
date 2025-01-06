export type GetProfileReturnType = {
  userId: string
  nickname: string
  username: string
  linkTiktok?: string
  linkInstagram?: string
  biography: string | undefined
  profilePhoto: string | undefined
  backgroundPhoto: string | undefined
  privacy: string
  following: number
  followers: number
  isFriend: boolean | undefined
  isFollowing: boolean | undefined
  email: string | undefined
}