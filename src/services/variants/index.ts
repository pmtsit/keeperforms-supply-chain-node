import { AxiosInstance } from 'axios';
import BaseService from '../base';
import {Variant} from '../../models/variant';
import { classToPlain, Expose, plainToClass } from 'class-transformer';

export interface IVariantAttributeItem {
  attribute: string;
  value?: string;
}

export class VariantAttributeItem implements IVariantAttributeItem {
  public attribute: string;
  public value?: string;

  constructor(variantAttributeItem: IVariantAttributeItem) {
    Object.assign(this, variantAttributeItem);
  }
}

export interface ICreateVariantParams {
  name: string;
  product?: string;
  description?: string;
  image?: string;
  attributes?: IVariantAttributeItem[];
}

export class CreateVariantParams implements ICreateVariantParams {
  public name: string;
  public product?: string;
  public description?: string;
  public image?: string;
  public attributes?: IVariantAttributeItem[];

  constructor(createVariantParams: ICreateVariantParams) {
    let _createVariantParams = createVariantParams;
    let _attributes: VariantAttributeItem[] | null = null;

    if (createVariantParams.attributes) {
      _attributes = createVariantParams.attributes!.map(attribute => new VariantAttributeItem(attribute));

      const {attributes, ...rest} = createVariantParams;
      _createVariantParams = rest;

      this.attributes = _attributes;
    }

    Object.assign(this, _createVariantParams);
  }
}

export interface IPatchVariantParams {
  name?: string;
  product?: string;
  description?: string;
  image?: string;
  attributes?: IVariantAttributeItem[];
}

export class PatchVariantParams implements IPatchVariantParams {
  public name?: string;
  public product?: string;
  public description?: string;
  public image?: string;
  public attributes?: IVariantAttributeItem[];

  constructor(patchVariantParams: IPatchVariantParams) {
    let _patchVariantParams = patchVariantParams;
    let _attributes: VariantAttributeItem[] | null = null;

    if (patchVariantParams.attributes) {
      _attributes = patchVariantParams.attributes!.map(attribute => new VariantAttributeItem(attribute));

      const {attributes, ...rest} = patchVariantParams;
      _patchVariantParams = rest;

      this.attributes = _attributes;
    }

    Object.assign(this, _patchVariantParams);
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
