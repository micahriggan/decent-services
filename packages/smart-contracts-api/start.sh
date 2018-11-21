#!/bin/bash
echo "Cleaning build files"
rm -rf ./blockchain/build
migrate_msg=$(cd ./blockchain && truffle migrate)
echo "$migrate_msg"

export PaymentValidator=$(echo "$migrate_msg" | grep "PaymentValidator: " | cut -f 4 -d " ")
echo $PaymentValidator
export ApiMonetization=$(echo "$migrate_msg" | grep "ApiMonetization: " | cut -f 4 -d " ")
echo $ApiMonetization

node ./ts_build/index.js
