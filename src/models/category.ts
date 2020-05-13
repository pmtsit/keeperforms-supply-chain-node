import { Expose, Type } from 'class-transformer';

export class Category {
  public id: string;
  public name: string;
  public parent?: Category;
  public children?: Category[];
  public description?: string;
  public image?: string;
}
