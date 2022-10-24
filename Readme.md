# Peaq-Aptos Bridge


## About This Repo
This is a mono repo containing contracts for both peaq evm side and aptos as well front-end and Oracle with proxy.

## Getting Started

Before starting the bridge make sure you have setup the required environment.

### Requirments

:bulb: Before you begin, make sure you have the following installed and configured:

1. [Node.js V16 or above](https://nodejs.org/en/download/)
2. [Redis Server](https://redis.io/docs/getting-started/installation/)
3. [PostgresSql](https://www.postgresql.org/download/)


### Publishing Aptos Contract
##### Configuration

The first step to do before we can publish our move modules to the blockchain is to setup the the Move.toml correctly.The following section will explain how to setup Move.toml file.

1. First step is to setup these two in the toml file these are the account address which will publish the Bridge module and the WrappedCoin.They can be different but it is recommended to set them to same.
    ``` 
    AptosPeaqBridge = "<your account address which will hold the module>"
    WrappedAptCoin = "<your account address which will hold the module>"
    ```
If you need help in setting up an account on aptos please refer to [Aptos Cli](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli) and [Create Account From CLI](https://aptos.dev/cli-tools/aptos-cli-tool/use-aptos-cli).

Now we are ready to deploy our moodules to the aptos blockchain.

To deploy the bridge to the aptos first we will need to compile our modules we can do so by using the command:
```
aptos move compile
```
We are now ready to publish our modules we can do so by using the following command:
```
aptos move publish
```
**NOTE**: If you get out of gas error run this command ``` aptos account fund-with-faucet --account default ``` or ``` aptos account fund-with-faucet --account <account address> ```.
For further information [Aptos CLI](https://aptos.dev/cli-tools/aptos-cli-tool/use-aptos-cli).

To find move modules ``` cd sources ``` from project root directory. 

### Publishing Peaq Contracts
To find the peaq contracts ``` cd peaq/ ``` from project root directory.
For publishing the peaq contracts to testnet in the easy way we can
[Remix](https://remix.ethereum.org/) or [Hardhat](https://hardhat.org/tutorial/deploying-to-a-live-network).

### Setting Up Oracle

After publishing our required contracts to the both chains now we are ready to setup our Oracle.

To initialize all the packages first ``` cd Oracle/ ``` from project root directory and run the following from Oracle root directory:

1. If using NPM

```
 npm i or npm install
```

2. If using [yarn](https://yarnpkg.com/getting-started/install)

```
yarn or yarn install
```

#### Env Setup

Before running the Orace make sure to setup `.env` file properly.

##### Environment Variables

- `PORT`
  This is the port number on which our server will run.If using the project for only cron this variable is optional.

* `NODE_ENV`
  Constant indicating whether to run the project in dev environment or production.
  **NOTE**: For running in production this variable should always be **`production`**
* `CHAIN_DATA_PEAQ`
Initial peaq chain data for Oracle to initialize. Has the following object structure: 
    ```json
    {
    "chain":"",
    "chainID":"",
    "lastProccessedBlock":"<initial block from where oracle will start reading logs from>"
    }
    ```
* `DB_CONFIG`
Configuration object for the database with the following structure:
    ```json
    {
    "host":"localhost",
    "dbUser":"",
    "dbName": "",
    "dbPass":"",
    "port":""
    }
    ```
* ###### Redis Bull Connection Variables
    ```
    REDIS_CONNECTION_BULL_HOST=""
    REDIS_CONNECTION_BULL_PORT=6379
    ```
    Connection settings for BullQueues,these can be safely left as it is if connecting to redis on local machine.


* `REDIS_CONNECTION_STRING`
  Redis connection string which will be used to connect to the redis instance.If this is not provided redis will by default connect to Host: localhost and Port:6379

  ###### Example connection string

  `redis://localhost:6379`



* `PEAQ_CONTRACT_ADDRESS`
Contract address for our bridge evm side contract, this is the address for which we will be getting logs of and processing.

* `PEAQ_WALLET_PRIVATE_KEY`
Private key of the user who deployed the contract to evm chain,this account will be used to interact with bridge.

* `APTOS_CONTRACT_ADDRESS`
    This is the address of the account which published the move contracts on aptos block chain.

* `APTOS_PUBLIC_KEY`
    This is the public key of the account whiich published the move contracts on aptos block chain.

* `APTOS_PRIVATE_KEY`
    This is the private key of the account whiich published the move contracts on aptos block chain.

* `MAX_GAS_APTOS`
    Max allowed gas for submitting transactions on aptos block chain.

* `DEFAULT_GAS_APTOS`
    Default gas for submitting transactions on aptos block chain.

* `Listener_Refresh_Interval`
    Interval for running background jobs for processingLogs and for processing any pending transactions.
* `APTOS_DEV_NET_URL`
    Rest end point which will be used to interact with aptos block chain.
* `PEAQ_RPC_URL`
    Peaq rpc url which will be used to get logs.

* `TX_HASH_LOCK_DURATION`
    Lock the process-transfer end point for the specified duration in ms for unique txHash so no same txHash will be processed more than once,this is to prevent the end point from processing the same transaction multiple times.

* `APTOS_WRAPPED_COIN_MODULE`
    Name of the wrapped coin module which we depoloyed to aptos block chain.

* `APTOS_BRIDGE_MODULE`
    Name of the bridge module which we depoloyed to aptos block chain.

* `APTOS_WRAPPED_COIN_DECIMALS`
    Decimals for the wrapped coin.
    **NOTE**: should be written as 1edecimals e.g. if our wrapped coin has 6 decimals this should be 1e6.

* `PROMISE_TIMEOUT_MS`
    Timout for getLogs function which returns a promise,this is to prevent the background job from getting stuck indefinitely.

* `BLOCKS_TO_PROCESS_IN_ONE_GO`
    Number of blocks in a single chunk which will be processed in getLogs.

* `PROXY_AUTH_KEY`
    Auth key for processing requests from proxy Oracle,should be the same as the one which we will set in Oracle-Proxy.

* `CHECK_TX_STATUS_TIMEOUT_MS`
    Timeout in MS for checking status of txHash from aptos chain after which the txHash will be put into pending transactions and will be processed later by a background process.

### Running the Oracle

After installing all the required packages and configuring all the required things we are finally ready to run our Oracle :smiley:.

Follow the following steps to run the Oracle:

- If using `npm`
    - If running dev environment
      `npm run dev`
    - If running in production environment
      `npm start`
      **Note**: no need to build before this command as this will automatically build first.
      **Note**: ``NODE_ENV`` should be set to **``` production```**.

- If using `yarn`
    - If running dev environment
      `yarn dev`
    - If running in production environment
      `yarn start`
      **Note**: no need to build before this command as this will automatically build first.
      **Note**: ``NODE_ENV`` should be set to **``` production```**.

### Running The proxy server
Setting up the proxy server is pretty straight forward.
To initialize all the packages first ``` cd Oracle-Proxy/ ``` from project root directory and run the following from Oracle-Proxy root directory:

1. If using NPM

```
 npm i or npm install
```

2. If using [yarn](https://yarnpkg.com/getting-started/install)

```
yarn or yarn install
```

#### Env Setup
Before running the Oracle Proxy make sure to setup .env file properly.

##### Environment Variables

* `PORT`
    Port on which our proxy will run.
* `ORACLE_END_POINT`
    Base url for our Oracle e.g. if Oracle is running on localhost and port 3002, this will http://localhost:3002.
* `ORACLE_API_KEY`
    Auth key which will be used as authorization mechanism for forwarding requests to the Oracle, should be same as the one set in Oracle.

Follow the following steps to run the Oracle Proxy:

- If using `npm`
    - If running dev environment
      `npm run dev`
    - If running in production environment
      `npm start`
      **Note**: no need to build before this command as this will automatically build first.
      **Note**: ``NODE_ENV`` should be set to **``` production```**.

- If using `yarn`
    - If running dev environment
      `yarn dev`
    - If running in production environment
      `yarn start`
      **Note**: no need to build before this command as this will automatically build first.
      **Note**: ``NODE_ENV`` should be set to **``` production```**.
  
#### Setting Bridge Front end
The last step before we can run and test the bridge is to setup the fron-end section.

To initialize all the packages first ``` cd front-end/ ``` from project root directory and run the following from Oracle-Proxy root directory:

1. If using NPM

```
 npm i or npm install
```

2. If using [yarn](https://yarnpkg.com/getting-started/install)

```
yarn or yarn install
```
#### Env Setup

##### Environment Variables
 * `REACT_APP_APTOS_COIN_MODULE`
    Name of the wrapped coin module which we depoloyed to aptos block chain. Should be the same one as the one set in Oracle.
* `REACT_APP_APTOS_BRIDGE_MODULE`
    Name of the bridge module which we depoloyed to aptos block chain. Should be the same one as the one set in Oracle.
* `REACT_APP_PEAQ_CONTRACT`
    Contract address for our bridge evm side contract, this is the address for which we will be getting logs of and processing.Should be the same one as the one set in Oracle
* `REACT_APP_ORACLE_END_POINT`
    This is base url for Oracle-proxy end point. if Oracle Proxy is running on localhost and port 3001, this will http://localhost:3001.
* `REACT_APP_APTOS_NODE_URL`
    Rest end point which will be used to interact with aptos block chain.
* `REACT_APP_APTOS_MODULE_ADDRESS`
    This is the address of the account which published the move contracts on aptos block chain.

To run the front-end run ``` yarn start ``` or if using npm ``` npm run start ```.

If all the steps were succesfull our Bridge should be up and running.
