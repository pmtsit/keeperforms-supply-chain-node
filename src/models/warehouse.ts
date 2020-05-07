import { Expose, Type } from 'class-transformer';

export class Warehouse {
  public id: string;
  public name: string;
  public description?: string;
  @Expose({ name: 'profile_image' })
  public profileImage?: string;
}
