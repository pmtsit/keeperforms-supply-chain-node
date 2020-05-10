import { AxiosInstance } from 'axios';
import { classToPlain, Expose, plainToClass } from 'class-transformer';
import createDebug, { Debugger } from 'debug';
import { LoginResult } from '../../models/login-result';
import SupplyChainClient from '../../keeper-supply-chain-client';

export interface ILoginParams {
  username: string;
  password: string;
}

export class LoginParams implements ILoginParams {
  username: string;
  password: string;

  constructor(loginParams: ILoginParams) {
    Object.assign(this, loginParams);
  }
}

export default class AccountService {
  protected readonly client: SupplyChainClient;
  protected readonly axios?: AxiosInstance;
  protected endpoint: string = 'auth';

  protected readonly debug: Debugger;

  constructor(client: SupplyChainClient, axios: AxiosInstance) {
    this.debug = createDebug(`keeper-service account`);
    this.client = client;
    this.axios = axios;
  }

  public async login(params: ILoginParams): Promise<LoginResult | null> {
    if (!this.axios) {
      return null;
    }

    const res = await this.axios.post<LoginResult>(`${this.endpoint}/login`, classToPlain(new LoginParams(params)));

    const result = res.data as LoginResult;

    if (result) {
      this.debug(`logged in result is ${JSON.stringify(result)}`);
    } else {
      this.debug('failed login');
    }

    const loginResult = result ? plainToClass(LoginResult, result) : null;

    if (loginResult && loginResult.accessToken) {
      this.client.setToken(loginResult.accessToken);
    }

    return loginResult;
  }
}
