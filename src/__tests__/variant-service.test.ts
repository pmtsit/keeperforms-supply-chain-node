import SupplyChainClient from '../index';
import {Variant} from '../models/variant';
import {VariantAttribute} from '../models/variant-attribute';
import {Category} from '../models/category';
import {Product} from '../models/product';
import {ProductAttribute} from '../models/product-attribute';

let supplyChainClient: SupplyChainClient;
let variants: Variant[] = [];
let originalNumberOfItems: number = 0;

let createdItem: Variant | null = null;
let itemName: string;
let itemDescription: string;

let createdProduct: Product | null = null;
let createdProductAttribute: ProductAttribute | null = null;
let createdVariantAttribute: VariantAttribute | null = null;

describe('Variants Service Test', () => {
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

    test('Get Variants', async () => {
        variants = await supplyChainClient.variants.list();
        originalNumberOfItems = variants.length;
    }, 10000);

    test('Create product', async () => {
        const productName =
            'product for variant ' +
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
            itemName =
                'variant ' +
                Math.floor((Math.random() + 1) * 1000)
                    .toString()
                    .padStart(4, '0');
            itemDescription = 'A variant created from the test suite';
            createdItem = await supplyChainClient.variants.create({
                name: itemName,
                product: createdProduct!.id,
                attributes: [{
                    attribute: createdProductAttribute!.id,
                    value: 'test1',
                }],
                description: itemDescription,
            });

            expect(createdItem).toHaveProperty('name', itemName);
            expect(createdItem).toHaveProperty('description', itemDescription);
        }
    }, 10000);

    test('Create variant attribute', async () => {
        if (!createdItem || !createdProductAttribute) {
            throw new Error('cannot run test - createdItem or createdProductAttribute are null');
        } else {
            const attributeValue =
                'variant attribute ' +
                Math.floor((Math.random() + 1) * 1000)
                    .toString()
                    .padStart(4, '0');
            createdVariantAttribute = await supplyChainClient.variantAttributes.create({
                variant: createdItem!.id,
                attribute: createdProductAttribute!.id,
                value: attributeValue,
            });

            expect(createdVariantAttribute).toHaveProperty('value', attributeValue);
        }
    }, 10000);

    test('Patch variant', async () => {
        if (!createdItem || !createdVariantAttribute) {
            throw new Error('cannot run test - createdItem or createdVariantAttribute are null');
        } else {
            itemDescription = 'Neo-Description from the test-suite';
            createdItem = await supplyChainClient.variants.patch(createdItem.id, {
                description: itemDescription,
            });

            expect(createdItem).toHaveProperty('name', itemName);
            expect(createdItem).toHaveProperty('description', itemDescription);
        }
    }, 10000);

    test('Get variant again', async () => {
        if (!createdItem) {
            throw new Error('cannot run test - createdItem is null');
        } else {
            const item = await supplyChainClient.variants.get(createdItem.id);

            expect(item).toBeDefined();
            expect(createdItem).toHaveProperty('description', itemDescription);
        }
    }, 10000);

    test('Delete variant attribute', async () => {
        if (!createdVariantAttribute) {
            throw new Error('cannot run test - createdVariantAttribute is null');
        } else {
            const deleteResult = await supplyChainClient.variantAttributes.delete(createdVariantAttribute.id);

            expect(deleteResult).toHaveProperty('id', createdVariantAttribute.id);
            expect(deleteResult).toHaveProperty('result', true);
        }
    }, 10000);

    test('Delete variant', async () => {
        if (!createdItem) {
            throw new Error('cannot run test - createdItem is null');
        } else {
            const deleteResult = await supplyChainClient.variants.delete(createdItem.id);

            expect(deleteResult).toHaveProperty('id', createdItem.id);
            expect(deleteResult).toHaveProperty('result', true);
        }
    }, 10000);

    test('Delete variant product', async () => {
        if (!createdProduct) {
            throw new Error('cannot run test - createdProduct is null');
        } else {
            const deleteResult = await supplyChainClient.products.delete(createdProduct.id);

            expect(deleteResult).toHaveProperty('id', createdProduct.id);
            expect(deleteResult).toHaveProperty('result', true);
        }
    }, 10000);
});
