#!/usr/bin/env python3
#
# Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
# SPDX-License-Identifier: Apache-2.0
#

import argparse
import logging
import time

from damlassistant import get_package_id, start_trigger_service_in_background, kill_process, \
    add_trigger_to_service, wait_for_port, catch_signals, DEFAULT_TRIGGER_SERVICE_PORT


dar = 'target/supplychain-triggers.dar'

triggers_with_parties = [
    ("Seller", "DA.RefApps.SupplyChain.Triggers.AggregatedQuoteTrigger:trigger"),
    ("Seller", "DA.RefApps.SupplyChain.Triggers.DeliveryCompleteTrigger:trigger"),
    ("Warehouse1", "DA.RefApps.SupplyChain.Triggers.InventoryQuoteRequestTrigger:trigger"),
    ("Warehouse2", "DA.RefApps.SupplyChain.Triggers.InventoryQuoteRequestTrigger:trigger"),
    ("Supplier", "DA.RefApps.SupplyChain.Triggers.CalculateAggregatedQuoteTrigger:trigger"),
]

parser = argparse.ArgumentParser()
parser.add_argument('ledger_host')
parser.add_argument('ledger_port')
args = parser.parse_args()

logging.basicConfig(level=logging.DEBUG)

wait_for_port(host=args.ledger_host, port=args.ledger_port, timeout=30)

service = start_trigger_service_in_background(dar=dar, ledger_host=args.ledger_host, ledger_port=args.ledger_port)
try:
    catch_signals()
    package_id = get_package_id(dar)
    wait_for_port(host='localhost', port='8088', timeout=30)
    for party, triggerName in triggers_with_parties:
        add_trigger_to_service(party=party, package_id=package_id, trigger=triggerName)

    def print_message_after_triggers_started(m: str):
        time.sleep(3)
        print(m)

    print_message_after_triggers_started('\nPress Ctrl+C to stop...')
    service.wait()
    logging.error(f"Trigger service died unexpectedly:\n{service.stderr}")
finally:
    kill_process(service)
