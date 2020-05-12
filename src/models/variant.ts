import { Expose, Type } from 'class-transformer';
import {Product} from './product';
import {VariantAttribute} from './variant-attribute';

export class Variant {
  public id: string;
  public name: string;
  public product: Product;
  public description?: string;
  public image?: string;
  public attributes?: VariantAttribute[];
  public sku?: string;
}
