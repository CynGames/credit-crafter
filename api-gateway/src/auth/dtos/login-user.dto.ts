export class LoginUserDTO {
  email: string;
  password: string;
  returnSecureToken?: boolean = false;
}
