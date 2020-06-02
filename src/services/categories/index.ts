import { AxiosInstance } from 'axios';
import { Category } from '../../models/category';
import BaseService from '../base';
import { classToPlain, Expose, plainToClass } from 'class-transformer';
import {ListResult} from '../../models/list-result';
import {Warehouse} from '../../models/warehouse';

export interface ICreateCategoryParams {
  name: string;
  parent?: string;
  description?: string;
  image?: string;
}

export class CreateCategoryParams implements ICreateCategoryParams {
  public name: string;
  public parent?: string;
  public description?: string;
  public image?: string;

  constructor(createCategoryParams: ICreateCategoryParams) {
    Object.assign(this, createCategoryParams);
  }
}

export interface IPatchCategoryParams {
  name?: string;
  parent?: string;
  description?: string;
  image?: string;
}

export class PatchCategoryParams implements IPatchCategoryParams {
  public name?: string;
  public parent?: string;
  public description?: string;
  public image?: string;

  constructor(iPatchCategoryParams: IPatchCategoryParams) {
    Object.assign(this, iPatchCategoryParams);
  }
}

export default class CategoryService extends BaseService<Category> {
  constructor(axios: AxiosInstance) {
    super(axios, '/categories');
  }

  public async list(offset?: number, limit?: number): Promise<ListResult<Category>> {
    const result = await super._list(offset, limit);

    const categories = result ? plainToClass(Category, result.items) : [];

    return new ListResult<Category>(categories, result.total);
  }

  public async get(id: string): Promise<Category | null> {
    const result = await super._get(id);

    const category = result ? plainToClass(Category, result) : null;

    return category;
  }

  public async create(params: ICreateCategoryParams): Promise<Category | null> {
    const result = await super._create(classToPlain(new CreateCategoryParams(params)));

    const category = result ? plainToClass(Category, result) : null;

    return category;
  }

  public async patch(id: string, params: IPatchCategoryParams): Promise<Category | null> {
    const result = await super._patch(id, classToPlain(new PatchCategoryParams(params)));

    const category = result ? plainToClass(Category, result) : null;

    return category;
  }
}
