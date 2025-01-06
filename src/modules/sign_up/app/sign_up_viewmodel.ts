import { ROLE_TYPE } from "src/shared/domain/enums/role_type_enum";

interface SignUpViewmodelProps {
  userId: string;
  name: string;
  email: string;
  role: ROLE_TYPE;
}

export class SignUpViewmodel {
  private readonly _userId: string;
  private readonly _name: string;
  private readonly _email: string;
  private readonly _role: ROLE_TYPE;

  constructor(props: SignUpViewmodelProps) {
    this._userId = props.userId;
    this._name = props.name;
    this._email = props.email;
    this._role = props.role;
  }

  toJSON() {
    return {
      userId: this._userId,
      name: this._name,
      email: this._email,
      role: this._role,
      message: "Usuário criado com sucesso!",
    };
  }
}