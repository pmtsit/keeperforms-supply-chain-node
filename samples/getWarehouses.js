const SupplyChainClient = require('../lib/').default;

const supplyChainClient = new SupplyChainClient('uris', '[CHANGE_THIS]');

supplyChainClient.warehouses.list().then((warehouses) => console.log(JSON.stringify(warehouses)));
