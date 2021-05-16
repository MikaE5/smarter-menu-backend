const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.loadFromPath('../aws-config.json');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const categories = require('../data/smarter-menu/categories.json');

categories.forEach((category) => {
  const data = Object.assign(category, {
    customer_id: 'smarter-menu',
    id: 'category-' + uuidv4(),
  });
  const params = {
    TableName: 'smarter-menu-categories',
    Item: data,
  };

  dynamoDb.put(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  });
});
