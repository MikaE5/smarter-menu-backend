const AWS = require('aws-sdk');
const crypto = require('crypto');
const randomstring = require('randomstring');

AWS.config.loadFromPath('../aws-config.json');

const createUser = async () => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const customer_id = 'perle-kaffeebar';
  const username = 'perle-kaffeebar';
  const title = 'Perle Kaffeebar';
  const password = randomstring.generate(14);

  console.log('password:', password);

  const salt = crypto.randomBytes(128).toString('hex');
  const iterations = 10000;
  const key = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512');
  const hash = key.toString('hex');

  const user = {
    customer_id,
    username,
    password: {
      salt,
      iterations,
      hash,
    },
  };

  const pageConfig = {
    customer_id,
    id: `page-config/${customer_id}`,
    page_content: {
      bookmarks: {
        no_items: 'Keine Einträge in der Merkliste.',
        title: 'Merkliste',
        to_bookmarks: 'Zur Merkliste',
      },
      categories: {
        home_bread_crumb: 'Übersicht',
      },
      footer: {
        data_privacy: 'Datenschutz',
        imprint: 'Impressum',
        slogan: 'made possible with smarter-menu',
      },
      header: {
        title,
      },
      menu_items: {
        allergens: 'Allergene',
      },
    },
    style: {
      theme_url:
        'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    },
  };

  const userParams = {
    TableName: 'smarter-menu-user-db-prod',
    Item: user,
  };

  const pageConfigParams = {
    TableName: 'smarter-menu-db-prod',
    Item: pageConfig,
  };

  dynamoDb.put(userParams, (err, data) => {
    if (err) console.log(err);
    else console.log('user created successfully', data);
  });

  dynamoDb.put(pageConfigParams, (err, data) => {
    if (err) console.log(err);
    else console.log('page config created successfully', data);
  });
};

createUser();
