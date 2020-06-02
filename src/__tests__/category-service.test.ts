import SupplyChainClient from '../index';
import { Category } from '../models/category';

let supplyChainClient: SupplyChainClient;
let categories: Category[] = [];
let originalNumberOfItems: number = 0;

let createdItem: Category | null = null;
let createdChildCategory: Category | null = null;
let itemName: string;
let itemDescription: string;

describe('Categories Service Test', () => {
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

  test('Get Categories', async () => {
    categories = (await supplyChainClient.categories.list()).items;
    originalNumberOfItems = categories.length;
  }, 10000);

  test('Create category', async () => {
    itemName =
      'category ' +
      Math.floor((Math.random() + 1) * 1000)
        .toString()
        .padStart(4, '0');
    itemDescription = 'A category created from the test suite';
    createdItem = await supplyChainClient.categories.create({
      name: itemName,
      description: itemDescription,
    });

    expect(createdItem).toHaveProperty('name', itemName);
    expect(createdItem).toHaveProperty('description', itemDescription);
  }, 10000);

  test('Create child category', async () => {
    const childCategoryName =
      'child category ' +
      Math.floor((Math.random() + 1) * 1000)
        .toString()
        .padStart(4, '0');
    const childCategoryItemDescription = 'A child category created from the test suite';
    createdChildCategory = await supplyChainClient.categories.create({
      name: childCategoryName,
      parent: createdItem!.id,
      description: childCategoryItemDescription,
    });

    expect(createdChildCategory).toHaveProperty('name', childCategoryName);
    expect(createdChildCategory).toHaveProperty('description', childCategoryItemDescription);
  }, 10000);

  test('Patch category', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      itemDescription = 'Neo-Description from the test-suite';
      createdItem = await supplyChainClient.categories.patch(createdItem.id, {
        description: itemDescription,
      });

      expect(createdItem).toHaveProperty('name', itemName);
      expect(createdItem).toHaveProperty('description', itemDescription);
    }
  }, 10000);

  test('Get category again', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      const item = await supplyChainClient.categories.get(createdItem.id);

      expect(item).toBeDefined();
      expect(createdItem).toHaveProperty('description', itemDescription);
    }
  }, 10000);

  test('Delete child category', async () => {
    if (!createdItem || !createdChildCategory) {
      throw new Error('cannot run test - createdItem or createdChildCategory are null');
    } else {
      const deleteResult = await supplyChainClient.categories.delete(createdChildCategory.id);

      expect(deleteResult).toHaveProperty('id', createdChildCategory.id);
      expect(deleteResult).toHaveProperty('result', true);
    }
  }, 10000);

  test('Delete category', async () => {
    if (!createdItem) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      const deleteResult = await supplyChainClient.categories.delete(createdItem.id);

      expect(deleteResult).toHaveProperty('id', createdItem.id);
      expect(deleteResult).toHaveProperty('result', true);
    }
  }, 10000);
});
