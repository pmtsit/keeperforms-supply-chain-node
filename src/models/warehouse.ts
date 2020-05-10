import { Expose, Type } from 'class-transformer';

export class Workspace {
  public id: string;
  public name: string;
  public description?: string;
  public image?: string;
}
