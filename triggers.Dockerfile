#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

ARG sdk_vsn=1.7.0

FROM digitalasset/daml-sdk:${sdk_vsn}

USER root
RUN apt-get update || apt-get update
RUN apt-get -y install netcat-openbsd
USER daml

WORKDIR /home/daml

COPY --chown=daml daml.yaml .
COPY --chown=daml src src
COPY --chown=daml scripts scripts
COPY --chown=daml triggers triggers
RUN daml build --output /home/daml/target/supplychain.dar
RUN daml build --project-root triggers --output /home/daml/target/triggers.dar

ENV JAVA_TOOL_OPTIONS -Xmx128m

ENTRYPOINT scripts/waitForLedger.sh "$LEDGER_HOST" "$LEDGER_PORT" && \
           scripts/startTriggers.sh "$LEDGER_HOST" "$LEDGER_PORT" target/triggers.dar
