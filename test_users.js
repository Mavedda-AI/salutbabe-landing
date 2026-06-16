const https = require('https');
const crypto = require('crypto');
// We need to bypass JWT locally, or we can just fetch via API since it's bypassed in backend
const token = 'fake';
https.get('https://api.salutbabe.com/v1/admin/users?search=', {
  headers: { 'Authorization': 'Bearer ' + token }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      const users = data.payload.users;
      let tokenMap = {};
      users.forEach(u => {
        if (u.pushToken) {
          if (!tokenMap[u.pushToken]) tokenMap[u.pushToken] = [];
          tokenMap[u.pushToken].push(u.userNickname);
        }
      });
      for (const [tok, nicks] of Object.entries(tokenMap)) {
        if (nicks.length > 1) {
          console.log(`Token ${tok.substring(0,20)}... is shared by ${nicks.length} users:`, nicks);
        }
      }
      console.log('Total users with pushToken:', users.filter(u => u.pushToken).length);
    } catch(e) {
      console.error(e);
    }
  });
});
