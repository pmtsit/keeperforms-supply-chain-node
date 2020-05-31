import { Expose, Type } from 'class-transformer';
import { Category } from './category';
import { Variant } from './variant';
import { ProductAttribute } from './product-attribute';

export class VariantAttribute {
  public id: string;
  public variant: Variant;
  public attribute: ProductAttribute;
  public value?: string;
}
