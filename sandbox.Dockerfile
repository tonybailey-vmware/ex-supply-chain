#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

ARG sdk_vsn=1.3.0

FROM digitalasset/daml-sdk:${sdk_vsn} AS source

# use something else than /home/daml/ because it already has ./.daml/ with DAML installed
RUN mkdir -p /home/daml/app/
WORKDIR /home/daml/app

COPY --chown=daml daml.yaml .
COPY --chown=daml src/main/daml ./src/main/daml
COPY --chown=daml ui-backend.conf frontend-config.js /home/daml/

FROM source

EXPOSE 6865
EXPOSE 7500

ENTRYPOINT daml start \
  --sandbox-option="--address=0.0.0.0" \
  --sandbox-port 6865 \
# Cannot explicitly specify, because of: https://github.com/digital-asset/daml/issues/5777
# Relying on default port behaviour as of now.
#  --navigator-option="--port=7500" \
  --open-browser=no \
  --json-api-port=none
