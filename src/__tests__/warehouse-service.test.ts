import SupplyChainClient from '../index';
import { Warehouse } from '../models/warehouse';

let supplyChainClient: SupplyChainClient;
let warehouses: Warehouse[] = [];
let originalNumberOfItems: number = 0;

let createdItem: Warehouse | null = null;
let itemName: string;
let itemDescription: string;

describe('Warehouses Service Test', () => {
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

  test('Get Warehouses', async () => {
    const _result = await supplyChainClient.warehouses.list();
    console.log(JSON.stringify(_result));
    warehouses = _result.items;
    originalNumberOfItems = warehouses.length;
  }, 10000);

  test('Create warehouse', async () => {
    itemName =
      'warehouse ' +
      Math.floor((Math.random() + 1) * 1000)
        .toString()
        .padStart(4, '0');
    itemDescription = 'A warehouse created from the test suite';
    createdItem = await supplyChainClient.warehouses.create({
      name: itemName,
      description: itemDescription,
    });

    expect(createdItem).toHaveProperty('name', itemName);
    expect(createdItem).toHaveProperty('description', itemDescription);
  }, 10000);

  test('Patch warehouse', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      itemDescription = 'Neo-Description from the test-suite';
      createdItem = await supplyChainClient.warehouses.patch(createdItem.id, {
        description: itemDescription,
      });

      expect(createdItem).toHaveProperty('name', itemName);
      expect(createdItem).toHaveProperty('description', itemDescription);
    }
  }, 10000);

  test('Get warehouse again', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      const item = await supplyChainClient.warehouses.get(createdItem.id);

      expect(item).toBeDefined();
      expect(createdItem).toHaveProperty('description', itemDescription);
    }
  }, 10000);

  test('Delete warehouse', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      const deleteResult = await supplyChainClient.warehouses.delete(createdItem.id);

      expect(deleteResult).toHaveProperty('id', createdItem.id);
      expect(deleteResult).toHaveProperty('result', true);
    }
  }, 10000);
});
