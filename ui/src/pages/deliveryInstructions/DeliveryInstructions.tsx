/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useParty, useLedger } from "@daml/react";
import { DeliveryInstruction }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Delivery";
import { CreateEvent } from "@daml/ledger";

export default function DeliveryInstructions() {

  const party = useParty();
  const ledger = useLedger();
  const roles =
    useStreamQuery(DeliveryInstruction);

  function pickup(
            createEvent : CreateEvent<DeliveryInstruction>,
            _unused : any) {
    ledger.exercise(
      DeliveryInstruction.DeliveryInstruction_PickUp,
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
        ]}
        actions={[
          {
            name: "Pickup",
            handle: pickup,
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
