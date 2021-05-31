const AWS = require('aws-sdk');
const crypto = require('crypto');

AWS.config.loadFromPath('../aws-config.json');

const createUser = async () => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const salt = crypto.randomBytes(128).toString('hex');
  const iterations = 10000;
  const key = crypto.pbkdf2Sync('y7h0lvyU9SM', salt, iterations, 64, 'sha512');
  const hash = key.toString('hex');

  const user = {
    customer_id: 'smarter-menu',
    password: {
      salt,
      iterations,
      hash,
    },
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
