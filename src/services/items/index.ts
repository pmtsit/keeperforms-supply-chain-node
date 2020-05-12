import { AxiosInstance } from 'axios';
import { Item } from '../../models/item';
import BaseService from '../base';
import { classToPlain, Expose, plainToClass } from 'class-transformer';

export interface ICreateItemParams {
  name: string;
  description?: string;
  image?: string;
  product: string;
  variant?: string;
  serialNumber?: string;
}

export class CreateItemParams implements ICreateItemParams {
  public name: string;
  public description?: string;
  public image?: string;
  public product: string;
  public variant?: string;
  public serialNumber?: string;

  constructor(createItemParams: ICreateItemParams) {
    Object.assign(this, createItemParams);
  }
}

export interface IPatchItemParams {
  name?: string;
  description?: string;
  image?: string;
  serialNumber?: string;
}

export class PatchItemParams implements IPatchItemParams {
  public name?: string;
  public description?: string;
  public image?: string;
  public serialNumber?: string;

  constructor(patchItemParams: IPatchItemParams) {
    Object.assign(this, patchItemParams);
  }
}

export default class ItemService extends BaseService<Item> {
  constructor(axios: AxiosInstance) {
    super(axios, '/items');
  }

  public async list(offset?: number, limit?: number): Promise<Item[]> {
    const result = await super._list(offset, limit);

    const items = result ? plainToClass(Item, result) : [];

    return items;
  }

  public async get(id: string): Promise<Item | null> {
    const result = await super._get(id);

    const item = result ? plainToClass(Item, result) : null;

    return item;
  }

  public async create(params: ICreateItemParams): Promise<Item | null> {
    const result = await super._create(classToPlain(new CreateItemParams(params)));

    const item = result ? plainToClass(Item, result) : null;

    return item;
  }

  public async patch(id: string, params: IPatchItemParams): Promise<Item | null> {
    const result = await super._patch(id, classToPlain(new PatchItemParams(params)));

    const item = result ? plainToClass(Item, result) : null;

    return item;
  }
}
