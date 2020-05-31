import { Expose, Type } from 'class-transformer';
import { Product } from './product';
import { Variant } from './variant';

export class Item {
  public id: string;
  public name: string;
  public description?: string;
  public image?: string;
  public product: Product;
  public variant?: Variant;
}
