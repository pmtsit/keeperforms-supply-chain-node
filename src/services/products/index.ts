import { AxiosInstance } from 'axios';
import BaseService from '../base';
import { Product } from '../../models/product';
import { classToPlain, Expose, plainToClass } from 'class-transformer';
import {ListResult} from '../../models/list-result';
import {Warehouse} from '../../models/warehouse';

export interface ICreateProductParams {
  name: string;
  category?: string;
  description?: string;
  image?: string;
  attributes?: string[];
  upc?: string;
}

export class CreateProductParams implements ICreateProductParams {
  public name: string;
  public category?: string;
  public description?: string;
  public image?: string;
  public attributes?: string[];
  public upc?: string;

  constructor(createProductParams: ICreateProductParams) {
    Object.assign(this, createProductParams);
  }
}

export interface IPatchProductParams {
  name?: string;
  category?: string;
  description?: string;
  image?: string;
  attributes?: string[];
  upc?: string;
}

export class PatchProductParams implements IPatchProductParams {
  public name?: string;
  public category?: string;
  public description?: string;
  public image?: string;
  public attributes?: string[];
  public upc?: string;

  constructor(iPatchProductParams: IPatchProductParams) {
    Object.assign(this, iPatchProductParams);
  }
}

export default class ProductService extends BaseService<Product> {
  constructor(axios: AxiosInstance) {
    super(axios, '/products');
  }

  public async list(offset?: number, limit?: number): Promise<ListResult<Product>> {
    const result = await super._list(offset, limit);

    const products = result ? plainToClass(Product, result.items) : [];

    return new ListResult<Product>(products, result.total);
  }

  public async get(id: string): Promise<Product | null> {
    const result = await super._get(id);

    const product = result ? plainToClass(Product, result) : null;

    return product;
  }

  public async create(params: ICreateProductParams): Promise<Product | null> {
    const result = await super._create(classToPlain(new CreateProductParams(params)));

    const product = result ? plainToClass(Product, result) : null;

    return product;
  }

  public async patch(id: string, params: IPatchProductParams): Promise<Product | null> {
    const result = await super._patch(id, classToPlain(new PatchProductParams(params)));

    const product = result ? plainToClass(Product, result) : null;

    return product;
  }
}
