const AWS = require('aws-sdk');

AWS.config.loadFromPath('../aws-config.json');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const config = require('../data/smarter-menu/config.json');
const data = Object.assign(config, {
  customer_id: 'smarter-menu',
  id: 'page-config/smarter-menu',
});
const params = {
  TableName: 'smarter-menu-db-prod',
  Item: data,
};

dynamoDb.put(params, (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});
