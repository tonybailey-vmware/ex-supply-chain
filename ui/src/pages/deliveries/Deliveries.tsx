/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useParty, useLedger } from "@daml/react";
import { Delivery }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Delivery";
import { CreateEvent } from "@daml/ledger";

export default function Deliveries() {

  const party = useParty();
  const ledger = useLedger();
  const roles =
    useStreamQuery(Delivery);

  function acknowledge(
            createEvent : CreateEvent<Delivery>,
            _unused : any) {
    ledger.exercise(
      Delivery.Delivery_Acknowledge,
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
          { name: "Warehouse", path: "payload.warehouse" },
          { name: "Transport company", path: "payload.transportCompany" },
          { name: "Product Name", path: "payload.productName" },
          { name: "Quantity", path: "payload.quantity" },
        ]}
        actions={[
          {
            name: "Acknowledge",
            handle: acknowledge,
            paramName: "",
            condition: (c) => c.payload.buyer === party,
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
