import axios, { AxiosInstance } from 'axios';
import createDebug from 'debug';
import AccountService from '../services/account';
import WarehouseService from '../services/warehouses';
import ItemService from '../services/items';
import CategoryService from '../services/categories';
import ProductService from '../services/products';
import ProductAttributeService from '../services/product-attributes';
import VariantService from '../services/variants';
import VariantAttributeService from '../services/variant-attributes';

export default class SupplyChainClient {
  public readonly account: AccountService;
  public readonly warehouses: WarehouseService;
  public readonly categories: CategoryService;
  public readonly products: ProductService;
  public readonly productAttributes: ProductAttributeService;
  public readonly variants: VariantService;
  public readonly variantAttributes: VariantAttributeService;
  public readonly items: ItemService;
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

    this.account = new AccountService(this, this.axios);
    this.warehouses = new WarehouseService(this.axios);
    this.categories = new CategoryService(this.axios);
    this.products = new ProductService(this.axios);
    this.productAttributes = new ProductAttributeService(this.axios);
    this.variants = new VariantService(this.axios);
    this.variantAttributes = new VariantAttributeService(this.axios);
    this.items = new ItemService(this.axios);
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
