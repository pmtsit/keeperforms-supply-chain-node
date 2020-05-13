import { Expose, Type } from 'class-transformer';
import { Category } from './category';
import { ProductAttribute } from './product-attribute';

export class Product {
  public id: string;
  public name: string;
  public category: Category;
  public description?: string;
  public image?: string;
  public upc?: string;
  public attributes?: ProductAttribute[];
}
