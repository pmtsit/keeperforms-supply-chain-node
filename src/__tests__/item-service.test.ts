import SupplyChainClient from '../index';
import { Item } from '../models/item';
import { Product } from '../models/product';
import { ProductAttribute } from '../models/product-attribute';
import { VariantAttribute } from '../models/variant-attribute';
import { Variant } from '../models/variant';

let supplyChainClient: SupplyChainClient;
let items: Item[] = [];
let originalNumberOfItems: number = 0;

let createdItem: Item | null = null;
let itemName: string;
let itemDescription: string;

let createdProduct: Product | null = null;
let createdProductAttribute: ProductAttribute | null = null;
let createdVariant: Variant | null = null;

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
    items = (await supplyChainClient.items.list()).items;
    originalNumberOfItems = items.length;
  }, 10000);

  test('Create product', async () => {
    const productName =
      'product for item ' +
      Math.floor((Math.random() + 1) * 1000)
        .toString()
        .padStart(4, '0');
    createdProduct = await supplyChainClient.products.create({
      name: productName,
    });

    expect(createdProduct).toHaveProperty('name', productName);
  }, 10000);

  test('Create product attribute', async () => {
    const attributeName =
      'product attribute ' +
      Math.floor((Math.random() + 1) * 1000)
        .toString()
        .padStart(4, '0');
    createdProductAttribute = await supplyChainClient.productAttributes.create({
      name: attributeName,
    });

    expect(createdProductAttribute).toHaveProperty('name', attributeName);
  }, 10000);

  test('Create variant', async () => {
    if (!createdProduct || !createdProductAttribute) {
      throw new Error('cannot run test - createdProduct or createdProductAttribute are null');
    } else {
      const variantName =
        'variant ' +
        Math.floor((Math.random() + 1) * 1000)
          .toString()
          .padStart(4, '0');
      const variantDescription = 'A variant created from the test suite';
      createdVariant = await supplyChainClient.variants.create({
        name: variantName,
        product: createdProduct!.id,
        sku: Math.floor((Math.random() + 1) * 1000)
          .toString()
          .padStart(4, '0'),
        attributes: [
          {
            attribute: createdProductAttribute!.id,
            value: 'test1',
          },
        ],
        description: variantDescription,
      });

      expect(createdVariant).toHaveProperty('name', variantName);
      expect(createdVariant).toHaveProperty('description', variantDescription);
    }
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
      product: createdProduct!.id,
      variant: createdVariant!.id,
      serialNumber: Math.floor((Math.random() + 1) * 1000)
        .toString()
        .padStart(10, '0'),
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

  test('Delete item attribute', async () => {
    if (!createdVariant) {
      throw new Error('cannot run test - createdVariant is null');
    } else {
      const variantAttributeId = createdVariant.attributes![0].id;
      const deleteResult = await supplyChainClient.variantAttributes.delete(variantAttributeId);

      expect(deleteResult).toHaveProperty('id', variantAttributeId);
      expect(deleteResult).toHaveProperty('result', true);
    }
  }, 10000);

  test('Delete variant', async () => {
    if (!createdVariant) {
      throw new Error('cannot run test - createdItem is null');
    } else {
      const deleteResult = await supplyChainClient.variants.delete(createdVariant.id);

      expect(deleteResult).toHaveProperty('id', createdVariant.id);
      expect(deleteResult).toHaveProperty('result', true);
    }
  }, 10000);

  test('Delete item product', async () => {
    if (!createdProduct) {
      throw new Error('cannot run test - createdProduct is null');
    } else {
      const deleteResult = await supplyChainClient.products.delete(createdProduct.id);

      expect(deleteResult).toHaveProperty('id', createdProduct.id);
      expect(deleteResult).toHaveProperty('result', true);
    }
  }, 10000);
});
