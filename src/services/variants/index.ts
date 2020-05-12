import { AxiosInstance } from 'axios';
import BaseService from '../base';
import {Variant} from '../../models/variant';
import { classToPlain, Expose, plainToClass } from 'class-transformer';

export interface ICreateVariantParams {
  name: string;
  product?: string;
  description?: string;
  image?: string;
}

export class CreateVariantParams implements ICreateVariantParams {
  public name: string;
  public product?: string;
  public description?: string;
  public image?: string;

  constructor(createVariantParams: ICreateVariantParams) {
    Object.assign(this, createVariantParams);
  }
}

export interface IPatchVariantParams {
  name?: string;
  product?: string;
  description?: string;
  image?: string;
}

export class PatchVariantParams implements IPatchVariantParams {
  public name?: string;
  public product?: string;
  public description?: string;
  public image?: string;

  constructor(iPatchVariantParams: IPatchVariantParams) {
    Object.assign(this, iPatchVariantParams);
  }
}

export default class VariantService extends BaseService<Variant> {
  constructor(axios: AxiosInstance) {
    super(axios, '/variants');
  }

  public async list(offset?: number, limit?: number): Promise<Variant[]> {
    const result = await super._list(offset, limit);

    const variants = result ? plainToClass(Variant, result) : [];

    return variants;
  }

  public async get(id: string): Promise<Variant | null> {
    const result = await super._get(id);

    const variant = result ? plainToClass(Variant, result) : null;

    return variant;
  }

  public async create(params: ICreateVariantParams): Promise<Variant | null> {
    const result = await super._create(classToPlain(new CreateVariantParams(params)));

    const variant = result ? plainToClass(Variant, result) : null;

    return variant;
  }

  public async patch(id: string, params: IPatchVariantParams): Promise<Variant | null> {
    const result = await super._patch(id, classToPlain(new PatchVariantParams(params)));

    const variant = result ? plainToClass(Variant, result) : null;

    return variant;
  }
}
