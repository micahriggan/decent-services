#!/bin/bash 
./build.sh
lerna run api:start --parallel
