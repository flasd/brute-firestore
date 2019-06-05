express-brute-firestore
===================

A Firestore store for [express-brute](https://github.com/AdamPflug/express-brute).

[![npm version](https://badge.fury.io/js/express-brute-firestore.svg)](https://www.npmjs.com/package/express-brute-firestore)
[![npm downloads per month](https://img.shields.io/npm/dm/express-brute-firestore.svg)](https://www.npmjs.com/package/express-brute-firestore)

## Installation
Install the latest version of express-brute-firestore:
(note: this package requires NodeJs >= 7.6)
```
npm install express-brute-firestore --save

// or, with yarn
yarn add express-brute-firestore
```

## Usage
```javascript
const express = require('express');
const ExpressBrute = require('express-brute');
const FirestoreStore = require('express-brute-firestore');
const admin = require('firebase-admin');

admin.initializeApp();

const app = express();
const store = new FirestoreStore(admin.firestore(), 'BRUTE_FORCE_COLLECTION');

const bruteGuard = new ExpressBrute(store);

app.post('/unprotected-route', bruteGuard.prevent, (req, res) => { /* your usual logic */ });
```

### Copyright & License

Copyright (c) 2019 [Marcel de Oliveira Coelho](https://github.com/husscode) under the [MIT License](https://github.com/husscode/cpf-check/blob/master/LICENSE.md). Go Crazy. :rocket: