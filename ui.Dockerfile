#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

FROM node:alpine

RUN npm install -g react-scripts express express-http-proxy
RUN yarn global add serve

WORKDIR /home/node/deploy

EXPOSE 5000

# needs deploy/ mounted
ENTRYPOINT serve -s build
