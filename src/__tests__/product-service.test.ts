import SupplyChainClient from '../index';
import {Product} from '../models/product';
import {ProductAttribute} from '../models/product-attribute';
import {Category} from '../models/category';

let supplyChainClient: SupplyChainClient;
let products: Product[] = [];
let originalNumberOfItems: number = 0;

let createdItem: Product | null = null;
let itemName: string;
let itemDescription: string;

let createdProductCategory: Category | null = null;
let createdProductAttribute: ProductAttribute | null = null;

describe('Products Service Test', () => {
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

    test('Get Products', async () => {
        products = await supplyChainClient.products.list();
        originalNumberOfItems = products.length;
    }, 10000);

    test('Create product', async () => {
        itemName =
            'product ' +
            Math.floor((Math.random() + 1) * 1000)
                .toString()
                .padStart(4, '0');
        itemDescription = 'A product created from the test suite';
        createdItem = await supplyChainClient.products.create({
            name: itemName,
            description: itemDescription,
        });

        expect(createdItem).toHaveProperty('name', itemName);
        expect(createdItem).toHaveProperty('description', itemDescription);
    }, 10000);

    test('Create category', async () => {
        const categoryName =
            'category ' +
            Math.floor((Math.random() + 1) * 1000)
                .toString()
                .padStart(4, '0');
        createdProductCategory = await supplyChainClient.categories.create({
            name: categoryName,
        });

        expect(createdProductCategory).toHaveProperty('name', categoryName);
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

    test('Patch product', async () => {
        if (!createdItem || !createdProductAttribute) {
            throw new Error('cannot run test - createdItem or createdProductAttribute are null');
        } else {
            itemDescription = 'Neo-Description from the test-suite';
            createdItem = await supplyChainClient.products.patch(createdItem.id, {
                description: itemDescription,
                upc: Math.floor((Math.random() + 1) * 1000)
                    .toString()
                    .padStart(4, '0'),
                category: createdProductCategory!.id,
                attributes: [createdProductAttribute!.id],
            });

            expect(createdItem).toHaveProperty('name', itemName);
            expect(createdItem).toHaveProperty('description', itemDescription);
            expect(createdItem).toHaveProperty('attributes');
        }
    }, 10000);

    test('Get product again', async () => {
        if (!createdItem) {
            throw new Error('cannot run test - createdItem is null');
        } else {
            const item = await supplyChainClient.products.get(createdItem.id);

            expect(item).toBeDefined();
            expect(createdItem).toHaveProperty('description', itemDescription);
        }
    }, 10000);

    test('Delete product', async () => {
        if (!createdItem) {
            throw new Error('cannot run test - createdItem is null');
        } else {
            const deleteResult = await supplyChainClient.products.delete(createdItem.id);

            expect(deleteResult).toHaveProperty('id', createdItem.id);
            expect(deleteResult).toHaveProperty('result', true);
        }
    }, 10000);

    test('Delete product attribute', async () => {
        if (!createdProductAttribute) {
            throw new Error('cannot run test - createdProductAttribute is null');
        } else {
            const deleteResult = await supplyChainClient.productAttributes.delete(createdProductAttribute.id);

            expect(deleteResult).toHaveProperty('id', createdProductAttribute.id);
            expect(deleteResult).toHaveProperty('result', true);
        }
    }, 10000);
});
