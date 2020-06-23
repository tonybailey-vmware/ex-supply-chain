/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useParty, useLedger } from "@daml/react";
import { TransportPending }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Delivery";
import { CreateEvent } from "@daml/ledger";

export default function TransportPendings() {

  const party = useParty();
  const ledger = useLedger();
  const roles =
    useStreamQuery(TransportPending);

  function deliver(
            createEvent : CreateEvent<TransportPending>,
            _unused : any) {
    ledger.exercise(
      TransportPending.TransportPending_Deliver,
      createEvent.contractId,
      {});
  };

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
          { name: "Product Name", path: "payload.productName" },
          { name: "Quantity", path: "payload.quantity" },
        ]}
        actions={[
          {
            name: "Deliver",
            handle: deliver,
            paramName: "",
            condition: (c) => c.payload.transportCompany === party,
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
