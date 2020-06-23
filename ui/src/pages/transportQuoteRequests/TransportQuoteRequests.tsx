/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts, { field, date, number } from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger } from "@daml/react";
import { AggregatedQuote }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Aggregate";
import { CreateEvent } from "@daml/ledger";

export default function TransportQuoteRequests() {

  const ledger = useLedger();
  const roles =
    useStreamQuery(AggregatedQuote);

  return (
    <>
      <div>
      <Contracts
        contracts={roles.contracts}
        columns={[
          { name: "Workflow ID", path: "payload.workflowId" },
          { name: "Buyer", path: "payload.buyer" },
          { name: "Buyer Address", path: "payload.buyerAddress" },
          { name: "Seller", path: "payload.seller" },
          { name: "Supplier", path: "payload.supplier" },
        ]}
        actions={[]}
        dialogs={[]}
      />
      </div>
    </>
  );
}
