import SupplyChainClient from '../index';
import { ProductAttribute } from '../models/product-attribute';

let supplyChainClient: SupplyChainClient;
let productAttributes: ProductAttribute[] = [];
let originalNumberOfItems: number = 0;

let createdItem: ProductAttribute | null = null;
let itemName: string;

describe('ProductAttributes Service Test', () => {
  beforeAll(async () => {
    supplyChainClient = new SupplyChainClient(process.env.USERNAME || '[USERNAME]', process.env.TOKEN || '');

    if (process.env.SERVER_URL) {
      supplyChainClient.setBaseUrl(process.env.SERVER_URL);
    }

    if (process.env.USERNAME && process.env.PASSWORD) {
      const loginResult = await supplyChainClient.account.login({
        username: process.env.USERNAME!,
        password: process.env.PASSWORD!,
      });

      expect(loginResult).toBeDefined();
      expect(loginResult?.accessToken).toBeDefined();
    }
  });

  test('client', async () => {
    expect(supplyChainClient).toBeDefined();
  }, 10000);

  test('Get ProductAttributes', async () => {
    productAttributes = (await supplyChainClient.productAttributes.list()).items;
    originalNumberOfItems = productAttributes.length;
  }, 10000);

  test('Create productAttribute', async () => {
    itemName =
      'productAttribute ' +
      Math.floor((Math.random() + 1) * 1000)
        .toString()
        .padStart(4, '0');
    createdItem = await supplyChainClient.productAttributes.create({
      name: itemName,
    });

    expect(createdItem).toHaveProperty('name', itemName);
  }, 10000);

  test('Patch productAttribute', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      itemName = itemName + ' changed';
      createdItem = await supplyChainClient.productAttributes.patch(createdItem.id, {
        name: itemName,
      });

      expect(createdItem).toHaveProperty('name', itemName);
    }
  }, 10000);

  test('Get productAttribute again', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      const item = await supplyChainClient.productAttributes.get(createdItem.id);

      expect(item).toBeDefined();
      expect(createdItem).toHaveProperty('name', itemName);
    }
  }, 10000);

  test('Delete productAttribute', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      const deleteResult = await supplyChainClient.productAttributes.delete(createdItem.id);

      expect(deleteResult).toHaveProperty('id', createdItem.id);
      expect(deleteResult).toHaveProperty('result', true);
    }
  }, 10000);
});
