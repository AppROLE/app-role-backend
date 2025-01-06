interface SearchHistoryProps {
  id?: string;
  username: string;
  profileSearch: {
    profileUsername: string;
    profileNickname: string;
    profilePhoto?: string;
  }
}

export class SearchHistory {
  constructor(private props: SearchHistoryProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get username() {
    return this.props.username;
  }

  get profileSearch() {
    return this.props.profileSearch;
  }

  set setUsername(username: string) {
    this.props.username = username;
  }

  set setProfileSearch(profileSearch: {
    profileUsername: string;
    profileNickname: string;
    profilePhoto: string;
  }) {
    this.props.profileSearch = profileSearch;
  }
}