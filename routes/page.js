const express = require('express');

const request = require('request');
const crypto = require('crypto');

const serviceid = '538aa3d3-507e-499c-9213-3700f399b852';
const service_api_key = '23efc635-d239-482a-8c62-bdeb065b2f3e';
const service_api_secret = '38d86b2c-8d22-410a-b386-69b49f5d3e40';
const walletAddress = 'tlink1qax9xc94px5yvx4tk2xn9r5em3tg8x2tcms7xr';
const walletSecret = 'Hgf0vtJDOd0uuKO+djNokp5xw2Celw4t6sBtWjbWziU=';

function makeid() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function encrypt(key, str) {
  const hmac = crypto.createHmac('sha512', key);
  const signed = hmac.update(Buffer.from(str, 'utf-8')).digest('base64');
  return signed;
}

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('main');
});

router.get('/uploadComplete', (req, res, next) => {
  res.render('uploadComplete');
});

router.get('/loginUser', (req, res, next) => {
  res.render('loginUser');
});

router.post('/transaction', async (req, res, next) => {
  const timestamp = +new Date();
  const nonce = makeid();
  const time1 = timestamp.toString();
  const path = '/v1/memos';
  const rest = 'POST';

  const body = {
    memo: 'hash : 965cd83fb5adedcc4ccd4330204a8cc22b06e23afa40058f0d4439683eb55af2, kab : U33d7c0e1b0f04d7b5f67c9969aa2371d, eul : U509bfd36f7e31456d52c27d741c2d78d',
    walletAddress,
    walletSecret,
  };
  const sha = `${nonce + time1 + rest + path}?memo=${body.memo}&walletAddress=${walletAddress}&walletSecret=${walletSecret}`;
  console.log(sha);
  const signature = encrypt(service_api_secret, sha);

  const headers = {
    'service-api-key': service_api_key,
    nonce,
    timestamp: time1,
    signature,
    'Content-Type': 'application/json',
  };

  const options = {
    url: `https://test-api.blockchain.line.me${path}`,
    method: 'POST',
    headers,
    json: body,
  };
  await request(options, (error, response, body) => {
    if (error) console.log('에러에러(wise 점검 및 인터넷 연결 안됨)');

    console.log(body);
  });
  return res.redirect('/verify');
});

router.get('/verify', (req, res, next) => {
  res.render('verify');
});

module.exports = router;
