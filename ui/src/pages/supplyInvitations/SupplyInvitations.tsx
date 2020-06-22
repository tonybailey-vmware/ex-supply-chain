/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useParty, useLedger } from "@daml/react";
import { QuoteRequestSupplyInvitation }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/QuoteRequest";
import { useState } from "react";
import { CreateEvent } from "@daml/ledger";
import { OrderedProductList } from "../quoteRequests/OrderedProductList";

export default function SupplyInvitations() {

  const party = useParty();
  const ledger = useLedger();
  const roles =
    useStreamQuery(QuoteRequestSupplyInvitation);

  function acceptSupplyInvitation(
            createEvent : CreateEvent<QuoteRequestSupplyInvitation>,
            _unused : any) {
    ledger.exercise(
      QuoteRequestSupplyInvitation.QuoteRequestSupplyInvitation_Accept,
      createEvent.contractId,
      { });
  };

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [createEvent, setCreateEvent] = useState(undefined as CreateEvent<QuoteRequestSupplyInvitation> | undefined);

  function showOrderedProductListDialog(
            createEvent : CreateEvent<QuoteRequestSupplyInvitation>,
            _unused : any) {
    setDialogOpen(true);
    setCreateEvent(createEvent);
  };

  return (
    <>
      <div>
      <OrderedProductList ledger={ledger} createEvent={createEvent} isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} />
      <Contracts
        contracts={roles.contracts}
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
            name: "Accept",
            handle: acceptSupplyInvitation,
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
