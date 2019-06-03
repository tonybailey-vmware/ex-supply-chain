# Read Me -- Supply Chain Application

## Overview

An example application modeling a supply chain.

## Getting Started

### Installing

### Prerequisites
Be sure you have the following installed:
* DAML SDK 0.12.21
* Docker
* Java
* Maven

#### Build with Maven

Type:
```
mvn clean package
```
**Note:** If you change the DAML models locally, you need to run re-run this command before starting the application.

### Starting the App

Running on local machine requires three terminal tabs:
1. **run sandbox**:
```bash
daml sandbox -- --port 7600 --scenario DA.RefApps.SupplyChain.Scenarios:setup target/supplychain.dar
```
2. **run navigator backend**:
```bash
daml navigator -- server localhost 7600 --port 7500 --config-file ui-backend.conf
```
3. **run bots**:
```bash
java -jar target/supplychain-0.0.1-SNAPSHOT.jar -p 7600
```
Then you can navigate navigate to the URL: localhost:7500 with a browser to interact with the application.

### Running with Docker-compose
NOTE: This works on Linux, but on MacOS docker configuration needs to be changed to use at least 6 CPUs, due to a bug in the platform.

After maven build, one might start with
```bash
docker-compose up --build
```

and stop with
```bash
docker-compose down
```

### Resetting the Prototype

Reset the application by following these steps:
Stop the App by following the steps in Stopping the App section.
Start the App in Docker or Standalone by following the steps in the relevant section.

Stop the running applicationin each of the terminal tabs above (CTRL+C) and start again.

## This Guide

TODO

CONFIDENTIAL © 2019 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
Any unauthorized use, duplication or distribution is strictly prohibited.
