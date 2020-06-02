import { AxiosInstance } from 'axios';
import BaseService from '../base';
import { VariantAttribute } from '../../models/variant-attribute';
import { classToPlain, Expose, plainToClass } from 'class-transformer';
import {ListResult} from '../../models/list-result';
import {Warehouse} from '../../models/warehouse';

export interface ICreateVariantAttributeParams {
  variant: string;
  attribute: string;
  value?: string;
}

export class CreateVariantAttributeParams implements ICreateVariantAttributeParams {
  public variant: string;
  public attribute: string;
  public value?: string;

  constructor(createVariantAttributeParams: ICreateVariantAttributeParams) {
    Object.assign(this, createVariantAttributeParams);
  }
}

export interface IPatchVariantAttributeParams {
  value?: string;
}

export class PatchVariantAttributeParams implements IPatchVariantAttributeParams {
  public value?: string;

  constructor(patchVariantAttributeParams: IPatchVariantAttributeParams) {
    Object.assign(this, patchVariantAttributeParams);
  }
}

export default class VariantAttributeService extends BaseService<VariantAttribute> {
  constructor(axios: AxiosInstance) {
    super(axios, '/variant-attributes');
  }

  public async list(offset?: number, limit?: number): Promise<ListResult<VariantAttribute>> {
    const result = await super._list(offset, limit);

    const variantAttributes = result ? plainToClass(VariantAttribute, result.items) : [];

    return new ListResult<VariantAttribute>(variantAttributes, result.total);
  }

  public async get(id: string): Promise<VariantAttribute | null> {
    const result = await super._get(id);

    const variantAttribute = result ? plainToClass(VariantAttribute, result) : null;

    return variantAttribute;
  }

  public async create(params: ICreateVariantAttributeParams): Promise<VariantAttribute | null> {
    const result = await super._create(classToPlain(new CreateVariantAttributeParams(params)));

    const variantAttribute = result ? plainToClass(VariantAttribute, result) : null;

    return variantAttribute;
  }

  public async patch(id: string, params: IPatchVariantAttributeParams): Promise<VariantAttribute | null> {
    const result = await super._patch(id, classToPlain(new PatchVariantAttributeParams(params)));

    const variantAttribute = result ? plainToClass(VariantAttribute, result) : null;

    return variantAttribute;
  }
}
