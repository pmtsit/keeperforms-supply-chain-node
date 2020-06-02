import { AxiosInstance } from 'axios';
import BaseService from '../base';
import { ProductAttribute } from '../../models/product-attribute';
import { classToPlain, Expose, plainToClass } from 'class-transformer';
import {ListResult} from '../../models/list-result';
import {Warehouse} from '../../models/warehouse';

export interface ICreateProductAttributeParams {
  name: string;
}

export class CreateProductAttributeParams implements ICreateProductAttributeParams {
  public name: string;

  constructor(createProductAttributeParams: ICreateProductAttributeParams) {
    Object.assign(this, createProductAttributeParams);
  }
}

export interface IPatchProductAttributeParams {
  name?: string;
}

export class PatchProductAttributeParams implements IPatchProductAttributeParams {
  public name?: string;

  constructor(patchProductAttributeParams: IPatchProductAttributeParams) {
    Object.assign(this, patchProductAttributeParams);
  }
}

export default class ProductAttributeService extends BaseService<ProductAttribute> {
  constructor(axios: AxiosInstance) {
    super(axios, '/product-attributes');
  }

  public async list(offset?: number, limit?: number): Promise<ListResult<ProductAttribute>> {
    const result = await super._list(offset, limit);

    const productAttributes = result ? plainToClass(ProductAttribute, result.items) : [];

    return new ListResult<ProductAttribute>(productAttributes, result.total);
  }

  public async get(id: string): Promise<ProductAttribute | null> {
    const result = await super._get(id);

    const productAttribute = result ? plainToClass(ProductAttribute, result) : null;

    return productAttribute;
  }

  public async create(params: ICreateProductAttributeParams): Promise<ProductAttribute | null> {
    const result = await super._create(classToPlain(new CreateProductAttributeParams(params)));

    const productAttribute = result ? plainToClass(ProductAttribute, result) : null;

    return productAttribute;
  }

  public async patch(id: string, params: IPatchProductAttributeParams): Promise<ProductAttribute | null> {
    const result = await super._patch(id, classToPlain(new PatchProductAttributeParams(params)));

    const productAttribute = result ? plainToClass(ProductAttribute, result) : null;

    return productAttribute;
  }
}
