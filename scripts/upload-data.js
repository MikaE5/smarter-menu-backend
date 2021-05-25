const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.loadFromPath('../aws-config.json');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const categories = [
  {
    categories: [
      'category/smarter-menu-test/909938be-582e-46ce-9f79-24685dd2c1ad',
    ],
    customer_id: 'smarter-menu',
    item_number: 2,
    price: {
      amount: 3.6,
      unit: '€',
    },
    id: 'item/smarter-menu/106cc7f2-5803-4ef9-a289-1286295e495b',
    name: 'Cappuccino',
  },
]; //require('../data/smarter-menu/categories.json');

categories.forEach((category) => {
  const data = Object.assign(category, {
    customer_id: 'smarter-menu-test',
    id: 'item/smarter-menu-test/' + uuidv4(),
  });
  const params = {
    TableName: 'smarter-menu-db-prod',
    Item: data,
  };

  dynamoDb.put(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  });
});
