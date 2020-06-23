/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useParty, useLedger } from "@daml/react";
import { PickUpRequest }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Delivery";
import { CreateEvent } from "@daml/ledger";

export default function PickUpRequests() {

  const party = useParty();
  const ledger = useLedger();
  const roles =
    useStreamQuery(PickUpRequest);

  function accept(
            createEvent : CreateEvent<PickUpRequest>,
            _unused : any) {
    ledger.exercise(
      PickUpRequest.PickUpRequest_Accept,
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
            name: "Accept",
            handle: accept,
            paramName: "",
            condition: (c) => c.payload.warehouse === party,
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
