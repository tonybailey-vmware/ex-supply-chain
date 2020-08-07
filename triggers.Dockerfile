#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

ARG sdk_vsn=1.3.0

FROM digitalasset/daml-sdk:${sdk_vsn}

# use something else than /home/daml/ because it already has ./.daml/ with DAML installed
RUN mkdir -p /home/daml/app/
WORKDIR /home/daml/app

COPY --chown=daml scripts scripts

ENV JAVA_TOOL_OPTIONS -Xmx128m

ENTRYPOINT scripts/waitForLedger.sh "$LEDGER_HOST" "$LEDGER_PORT" && \
           scripts/startTriggers.sh "$LEDGER_HOST" "$LEDGER_PORT" .daml/dist/supplychain-1.0.0.dar
