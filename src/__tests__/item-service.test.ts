import SupplyChainClient from '../index';
import { Item } from '../models/item';

let supplyChainClient: SupplyChainClient;
let items: Item[] = [];
let originalNumberOfItems: number = 0;

let createdItem: Item | null = null;
let itemName: string;
let itemDescription: string;

describe('Items Service Test', () => {
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

  test('Get Items', async () => {
    items = await supplyChainClient.items.list();
    originalNumberOfItems = items.length;
  }, 10000);

  test('Create item', async () => {
    itemName =
      'item ' +
      Math.floor((Math.random() + 1) * 1000)
        .toString()
        .padStart(4, '0');
    itemDescription = 'A item created from the test suite';
    createdItem = await supplyChainClient.items.create({
      name: itemName,
      description: itemDescription,
    });

    expect(createdItem).toHaveProperty('name', itemName);
    expect(createdItem).toHaveProperty('description', itemDescription);
  }, 10000);

  test('Patch item', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      itemDescription = 'Neo-Description from the test-suite';
      createdItem = await supplyChainClient.items.patch(createdItem.id, {
        description: itemDescription,
      });

      expect(createdItem).toHaveProperty('name', itemName);
      expect(createdItem).toHaveProperty('description', itemDescription);
    }
  }, 10000);

  test('Get item again', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      const item = await supplyChainClient.items.get(createdItem.id);

      expect(item).toBeDefined();
      expect(createdItem).toHaveProperty('description', itemDescription);
    }
  }, 10000);

  test('Delete item', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      const deleteResult = await supplyChainClient.items.delete(createdItem.id);

      expect(deleteResult).toHaveProperty('id', createdItem.id);
      expect(deleteResult).toHaveProperty('result', true);
    }
  }, 10000);
});
