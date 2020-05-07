import axios, { AxiosInstance } from 'axios';
import createDebug from 'debug';
import WarehouseService from '../services/warehouses';

export default class SupplyChainClient {
  public readonly warehouses: WarehouseService;
  private readonly debug = createDebug('keeper-supply-chain-client');
  private readonly axios?: AxiosInstance;
  private readonly username: string;
  private apiKey: string;

  constructor(username: string, apiKey: string) {
    this.username = username;
    this.apiKey = apiKey;
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    this.axios = axios.create({
      baseURL: 'https://ksup.keeperforms.com/v1',
      headers,
      timeout: 5000,
    });

    this.warehouses = new WarehouseService(this.axios);
  }

  public setBaseUrl(baseUrl: string): void {
    if (this.axios) {
      this.axios.defaults.baseURL = baseUrl;
    }
  }

  public setToken(token: string): void {
    this.apiKey = token;
    if (this.axios) {
      this.axios.defaults.headers.Authorization = `Bearer ${this.apiKey}`;
    }
  }
}
