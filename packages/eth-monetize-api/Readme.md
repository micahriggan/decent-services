# Purpose
This repo contains a simple api used to issue signed messages that have payment requirements

There is a contract that accepts payments should they match an accompanying signed payment message

Payment Gas usage: 37025

# Usage / Installation
This repo can be used with testrpc or ganache

```
  npm install
  # Terminal 1: Test RPC
  npm run testrpc

  # Terminal 2: Unit Tests
  npm run test

  # Terminal 3:  Rest API
  npm start

  # Get an invoice payload
  curl http://localhost:3000/quote/1
```


# Tests

```
npm test

Using network 'testrpc'.



  Contract: PaymentValidator
    ✓ should be able to generate an invoice
    ✓ should be able to pay an invoice (47ms)
    ✓ should not be able to pay a wrong value
    ✓ should trigger the PaymentAccepted event (53ms)


  4 passing (177ms)
```
