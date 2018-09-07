#!/bin/bash
export PaymentValidator=$(cd ./blockchain && truffle migrate --network testrpc | grep "PaymentValidator" | cut -f 4 -d " ")
echo $PaymentValidator
node index.js
