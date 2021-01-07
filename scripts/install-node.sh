#!/usr/bin/env bash
#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

if [ $(id -u) != 0 ]
then
  echo Error: needs root privileges
  exit 1
fi

set -e
curl -sL https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs
