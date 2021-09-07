const AWS = require('aws-sdk');
AWS.config.loadFromPath('../aws-config.json');
require('dotenv').config();

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const customerMap = {};
const fillCustomerMap = (data) => {
  for (let doc of data) {
    const customer = doc.customer_id;
    if (customerMap[customer] === undefined) customerMap[customer] = [];

    customerMap[customer].push(doc);
  }
};

const checkCustomer = (customer) => {
  if (customerMap[customer] === undefined) {
    console.log(`No documents found for customer ${customer}.`);
    return;
  }
  const docs = customerMap[customer];
  const idSet = new Set(docs.map((doc) => doc.id));
  const items = docs.filter((doc) => doc.id.startsWith('item'));
  const categories = docs.filter((doc) => doc.id.startsWith('category'));

  const filterIds = (ids) => {
    if (ids === undefined) return [];
    return ids.filter((id) => !idSet.has(id));
  };

  const updateItemIfNecessary = async (item, missingIds, docType) => {
    if (missingIds.length === 0) return;
    console.log(`Item ${item.id} has missing ${docType}: ${missingIds}`);
    const idSet = new Set(missingIds);
    item[docType] = item[docType].filter((id) => !idSet.has(id));

    const putItemQuery = {
      TableName: process.env.SMARTER_MENU_DB_PROD,
      Item: item,
    };

    console.log(`Updating ${docType} for item ${item.id}.`);
    await dynamoDb.put(putItemQuery).promise();
  };

  items.forEach((item) => {
    const removeCategories = filterIds(item.categories);
    const removeClassifications = filterIds(item.classifications);
    const removeAllergens = filterIds(item.allergens);

    updateItemIfNecessary(item, removeCategories, 'categories');

    updateItemIfNecessary(item, removeClassifications, 'classifications');

    updateItemIfNecessary(item, removeAllergens, 'allergens');
  });

  categories.forEach((category) => {
    if (
      category.sub_categories === undefined ||
      category.category_type === 'C2'
    )
      return;

    const removeSubCategories = filterIds(category.sub_categories);

    updateItemIfNecessary(category, removeSubCategories, 'sub_categories');
  });
};

const params = {
  TableName: process.env.SMARTER_MENU_DB_PROD,
};

const validateData = async () => {
  const data = (await dynamoDb.scan(params).promise()).Items;

  fillCustomerMap(data);
  Object.keys(customerMap).forEach(checkCustomer);
};

validateData();
