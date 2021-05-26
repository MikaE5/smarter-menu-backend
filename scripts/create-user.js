const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');

AWS.config.loadFromPath('../aws-config.json');

const createUser = async () => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const user = {
    customer_id: 'smarter-menu',
    password: await bcrypt.hash('y7h0lvyU9SM', 10),
  };

  const params = {
    TableName: 'smarter-menu-user-db-prod',
    Item: user,
  };

  dynamoDb.put(params, (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  });
};

createUser();
