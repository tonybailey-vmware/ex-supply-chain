#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

ARG sdk_vsn=1.3.0

FROM digitalasset/daml-sdk:${sdk_vsn} AS source

# use something else than /home/daml/ because it already has ./.daml/ with DAML installed
RUN mkdir -p /home/daml/target
WORKDIR /home/daml/

COPY --chown=daml daml.yaml .
COPY --chown=daml src/main/daml ./src/main/daml
COPY --chown=daml Makefile .

FROM source

USER root
RUN apk add yarn make
USER daml

RUN make build-dar build-jscodegen

ENTRYPOINT ls target/ -la
