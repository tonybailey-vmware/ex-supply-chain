/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { AggregatedQuote }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Aggregate";
import { CreateEvent } from "@daml/ledger";

export default function AggregatedQuotes() {

  const party = useParty();
  const ledger = useLedger();
  const requests =
    useStreamQuery(AggregatedQuote);

  function addMargin(
            createEvent : CreateEvent<AggregatedQuote>,
            margin : any) {
    ledger.exercise(
      AggregatedQuote.AggregatedQuote_AddMargin,
      createEvent.contractId,
      { margin: margin });
  };


  const [isDialogOpen, setDialogOpen] = useState(false);
  const [createEvent, setCreateEvent] = useState(undefined as CreateEvent<AggregatedQuote> | undefined);

  function showTransportItemListDialog(
            createEvent : CreateEvent<AggregatedQuote>,
            _unused : any) {
    setDialogOpen(true);
    setCreateEvent(createEvent);
  };

  return (
    <>
      <div>
      <Contracts
        contracts={requests.contracts}
        columns={[
          { name: "Workflow ID", path: "payload.workflowId" },
          { name: "Buyer", path: "payload.buyer" },
          { name: "Buyer Address", path: "payload.buyerAddress" },
          { name: "Seller", path: "payload.seller" },
          { name: "Supplier", path: "payload.supplier" },
        ]}
        actions={[
          {
            name: "Show order",
            handle: showTransportItemListDialog,
            paramName: "",
            condition: (c) => true,
            items: [],
            values: [],
          },
          {
            name: "Add margin",
            handle: addMargin,
            paramName: "Margin",
            condition: (c) => c.payload.seller === party,
            items: [],
            values: [],
          },
        ]}
        dialogs={[]}
      />
      </div>
    </>
  );
}
