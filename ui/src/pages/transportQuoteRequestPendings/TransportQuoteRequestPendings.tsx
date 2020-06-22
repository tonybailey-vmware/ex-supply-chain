/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { TransportQuoteRequestPending }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/QuoteRequest";
import { CreateEvent } from "@daml/ledger";
import { OrderedProductList } from "../quoteRequests/OrderedProductList";

export default function TransportQuoteRequestPendings() {

  const party = useParty();
  const ledger = useLedger();
  const requests =
    useStreamQuery(TransportQuoteRequestPending);

  function chooseTransport(
            createEvent : CreateEvent<TransportQuoteRequestPending>,
            _unused : any) {
    ledger.exercise(
      TransportQuoteRequestPending.TransportQuoteRequestPending_ChooseTransport,
      createEvent.contractId,
      {});
  };

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [createEvent, setCreateEvent] = useState(undefined as CreateEvent<TransportQuoteRequestPending> | undefined);

  function showOrderedProductListDialog(
            createEvent : CreateEvent<TransportQuoteRequestPending>,
            _unused : any) {
    setDialogOpen(true);
    setCreateEvent(createEvent);
  };

  return (
    <>
      <div>
      <OrderedProductList ledger={ledger} createEvent={createEvent} isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} />
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
            handle: showOrderedProductListDialog,
            paramName: "",
            condition: (c) => true,
            items: [],
            values: [],
          },
          {
            name: "Choose transport",
            handle: chooseTransport,
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
