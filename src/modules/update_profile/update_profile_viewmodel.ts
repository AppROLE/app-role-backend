import { Profile } from 'src/shared/domain/entities/profile';

export class UpdateProfileViewmodel {
  profile: Profile;
  constructor(profile: Profile) {
    this.profile = profile;
  }

  toJSON() {
    return {
      profile: {
        userId: this.profile.userId,
        name: this.profile.name,
        username: this.profile.username,
        nickname: this.profile.nickname,
        email: this.profile.email,
        role: this.profile.role,
        acceptedTerms: this.profile.acceptedTerms,
        acceptedTermsAt: this.profile.acceptedTermsAt,
        createdAt: this.profile.createdAt,
        updatedAt: this.profile.updatedAt,
        isPrivate: this.profile.isPrivate,
        profilePhoto: this.profile.profilePhoto,
        followersLength: this.profile.followers.length,
        followingLength: this.profile.following.length,
        favorites: this.profile.favorites,
        reviewsId: this.profile.reviewsId,
        dateBirth: this.profile.dateBirth,
        cpf: this.profile.cpf,
        gender: this.profile.gender,
        phoneNumber: this.profile.phoneNumber,
        linkInstagram: this.profile.linkInstagram,
        linkTiktok: this.profile.linkTiktok,
        backgroundPhoto: this.profile.backgroundPhoto,
        biography: this.profile.biography,
      },
      message: 'Perfil atualizado com sucesso',
    };
  }
}
