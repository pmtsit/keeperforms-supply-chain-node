import { Expose } from 'class-transformer';

export class LoginResult {
  @Expose({ name: 'access_token' })
  accessToken: string;
}
