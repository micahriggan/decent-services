# Purpose
This repo provides the backend api and contracts for building an API monetization system on Ethereum

# How it works
* Contract
  * PaymenValidation
  * ApiCallAllocation
* Backend
  * Request a quote for X api calls
  * Pay for X api calls through ApiCallAllocation contract
    * Provide a pubkey.
    * Each API call will be signed with the privKey
  * Set allocation for pubKey to X
* Monetized Api
  * For a route, check that the caller's pubKey is registered on the ApiCallAllocation contract
