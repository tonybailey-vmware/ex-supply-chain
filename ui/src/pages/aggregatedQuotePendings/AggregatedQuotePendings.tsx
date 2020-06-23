/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { AggregatedQuotePending }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Aggregate";
import { CreateEvent } from "@daml/ledger";
import { TransportItemList } from "./TransportItemList";

export default function AggregatedQuotePendings() {

  const party = useParty();
  const ledger = useLedger();
  const requests =
    useStreamQuery(AggregatedQuotePending);

  function sendToSeller(
            createEvent : CreateEvent<AggregatedQuotePending>,
            _unused : any) {
    ledger.exercise(
      AggregatedQuotePending.AggregatedQuotePending_SendQuoteToSeller,
      createEvent.contractId,
      {});
  };

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [createEvent, setCreateEvent] = useState(undefined as CreateEvent<AggregatedQuotePending> | undefined);

  function showTransportItemListDialog(
            createEvent : CreateEvent<AggregatedQuotePending>,
            _unused : any) {
    setDialogOpen(true);
    setCreateEvent(createEvent);
  };

  return (
    <>
      <div>
      <TransportItemList ledger={ledger} createEvent={createEvent} isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} />
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
            name: "Send to seller",
            handle: sendToSeller,
            paramName: "",
            condition: (c) => c.payload.supplier === party,
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
