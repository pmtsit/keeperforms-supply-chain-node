import SupplyChainClient from '../index';

let supplyChainClient: SupplyChainClient;

describe('Generic Tests', () => {
  beforeAll(() => {
    supplyChainClient = new SupplyChainClient('uris', process.env.TOKEN!);

    if (process.env.SERVER_URL) {
      supplyChainClient.setBaseUrl(process.env.SERVER_URL);
    }
  });

  test('client', async () => {
    expect(supplyChainClient).toBeDefined();
  }, 10000);
});
