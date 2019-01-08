# Running

```
# Have ganache-cli running before starting
ganache-cli

npm install
npm start
```


# Service Registry
Services wait for the service-registry-api to start. Once started they register themselves and get a port number and start listening for requests


# Clients
Clients extend BaseClient and get their url from the service registry
