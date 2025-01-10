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
        privacy: this.profile.privacy,
        profilePhoto: this.profile.profilePhoto,
        followers: this.profile.followers,
        following: this.profile.following,
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
