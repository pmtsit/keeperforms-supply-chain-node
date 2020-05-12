import { AxiosInstance } from 'axios';
import { Warehouse } from '../../models/warehouse';
import BaseService from '../base';
import { classToPlain, Expose, plainToClass } from 'class-transformer';

export interface ICreateWarehouseParams {
  name: string;
  description?: string;
  image?: string;
}

export class CreateWarehouseParams implements ICreateWarehouseParams {
  public name: string;
  public description?: string;
  public image?: string;

  constructor(createWarehouseParams: ICreateWarehouseParams) {
    Object.assign(this, createWarehouseParams);
  }
}

export interface IPatchWarehouseParams {
  name?: string;
  description?: string;
  image?: string;
}

export class PatchWarehouseParams implements IPatchWarehouseParams {
  public name?: string;
  public description?: string;
  public image?: string;

  constructor(iPatchWarehouseParams: IPatchWarehouseParams) {
    Object.assign(this, iPatchWarehouseParams);
  }
}

export default class WarehouseService extends BaseService<Warehouse> {
  constructor(axios: AxiosInstance) {
    super(axios, '/warehouses');
  }

  public async list(offset?: number, limit?: number): Promise<Warehouse[]> {
    const result = await super._list(offset, limit);

    const warehouses = result ? plainToClass(Warehouse, result) : [];

    return warehouses;
  }

  public async get(id: string): Promise<Warehouse | null> {
    const result = await super._get(id);

    const warehouse = result ? plainToClass(Warehouse, result) : null;

    return warehouse;
  }

  public async create(params: ICreateWarehouseParams): Promise<Warehouse | null> {
    const result = await super._create(classToPlain(new CreateWarehouseParams(params)));

    const warehouse = result ? plainToClass(Warehouse, result) : null;

    return warehouse;
  }

  public async patch(id: string, params: IPatchWarehouseParams): Promise<Warehouse | null> {
    const result = await super._patch(id, classToPlain(new PatchWarehouseParams(params)));

    const warehouse = result ? plainToClass(Warehouse, result) : null;

    return warehouse;
  }
}
