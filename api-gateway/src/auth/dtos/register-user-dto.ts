export type RegisterUserDTO = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles?: string[];
};
