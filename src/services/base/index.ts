import { AxiosInstance } from 'axios';
import createDebug, { Debugger } from 'debug';
import { IDeleteResult } from '../../models/delete-result';

export default abstract class BaseService<T> {
  protected readonly axios?: AxiosInstance;
  protected endpoint: string = '';

  protected readonly debug: Debugger;

  protected constructor(axios: AxiosInstance, endpoint: string) {
    this.debug = createDebug(`keeper-service ${endpoint}`);
    this.axios = axios;
    this.endpoint = endpoint;
  }

  public async delete(id: string): Promise<IDeleteResult> {
    if (!this.axios) {
      return {
        id,
        message: 'axios not initialized',
        result: false,
      };
    }

    const res = await this.axios.delete(`${this.endpoint}/${id}`);

    const result = res.data as IDeleteResult;

    if (result && result.result) {
      this.debug(`deleted the item with ${id}`);
    } else {
      this.debug(`item with ${id} not deleted - ${result ? result.message : 'unknown reason'}`);
    }

    return result;
  }

  protected toClass(type: new () => T, plain: T): T {
    return new type();
  }

  protected async _get(id: string): Promise<T | null> {
    if (!this.axios) {
      return null;
    }

    const item = await this.axios
      .get(`${this.endpoint}/${id}`)
      .then(res => res.data as T)
      .catch(err => {
        this.debug(err);
        return null;
      });

    this.debug(item ? `got item ${JSON.stringify(item)}` : `failed getting item with id ${id}`);

    return item;
  }

  protected async _list(offset?: number, limit?: number, filter?: any): Promise<T[]> {
    if (!this.axios) {
      return [];
    }

    let params: any = {
      limit,
      offset,
    };

    if (filter) {
      params = {
        ...filter,
        ...params,
      };
    }

    this.debug(`********** params = ${params ? JSON.stringify(params) : 'none'}`);

    const items = await this.axios
      .get(this.endpoint, { params })
      .then(res => {
        this.debug(`********** total from header = ${res.headers['x-total-count'] || 'does not exist'}`);
        return res.data as T[];
      })
      .catch(err => {
        this.debug(err);
        return [];
      });

    this.debug(`got ${items.length} items`);

    return items;
  }

  protected async _create(params: any): Promise<T | null> {
    if (!this.axios) {
      return null;
    }

    const res = await this.axios.post<T>(this.endpoint, params);

    const item = res.data as T;

    if (item) {
      this.debug(`created the item ${JSON.stringify(item)}`);
    } else {
      this.debug('item not created');
    }

    return item;
  }

  protected async _post(path: string, params?: any): Promise<T | null> {
    if (!this.axios) {
      return null;
    }

    const res = await this.axios.post<T>(`${this.endpoint}/${path}`, params);

    const item = res.data as T;

    if (item) {
      this.debug(`posted and got ${JSON.stringify(item)}`);
    } else {
      this.debug('item not updated');
    }

    return item;
  }

  protected async _patch(id: string, params: any): Promise<T | null> {
    if (!this.axios) {
      return null;
    }

    const res = await this.axios.patch(`${this.endpoint}/${id}`, params);

    const item = res.data as T;

    if (item) {
      this.debug(`updated the item ${JSON.stringify(item)}`);
    } else {
      this.debug('item not changed');
    }

    return item;
  }
}
