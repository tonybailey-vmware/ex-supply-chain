#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

ARG sdk_vsn=1.3.0

FROM digitalasset/daml-sdk:${sdk_vsn} AS source

WORKDIR /home/daml/

COPY --chown=daml Makefile .
COPY --chown=daml daml.yaml .
COPY --chown=daml src src
COPY --chown=daml ui/package.json ui/package.json
COPY --chown=daml ui/public ui/public
COPY --chown=daml ui/rename-proxy.js ui/rename-proxy.js
COPY --chown=daml ui/src ui/src
COPY --chown=daml ui/tsconfig.json ui/tsconfig.json
COPY --chown=daml ui/yarn.lock ui/yarn.lock

FROM source

USER root
RUN apk add yarn make
USER daml

RUN make deploy

ENTRYPOINT echo "Build artifacts has been synced to shared volume:" && ls -l deploy/
