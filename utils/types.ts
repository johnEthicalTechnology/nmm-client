export interface ISignUpArgs {
  email: string;
  password: string;
  username: string;
}

export interface IUserMetadata {
  motivations: string;
  // other user data like goal?
}

export enum SignInTypes {
  auth0 = "AUTH0",
  social = "SOCIAL"
}