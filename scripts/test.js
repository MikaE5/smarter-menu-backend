const fetch = require('node-fetch');

fetch(
  ' https://992x1q7ut1.execute-api.eu-central-1.amazonaws.com/page-config',
  {
    method: 'post',
    headers: {
      'X-Netlify-Host': 'smarter-menu-netlify',
    },
    body: JSON.stringify({
      customer_id: 'smarter-menu',
    }),
  }
)
  .then((res) => res.json())
  .then(console.log);
