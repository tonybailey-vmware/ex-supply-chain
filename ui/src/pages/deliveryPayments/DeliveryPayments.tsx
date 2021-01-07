/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger } from "@daml/react";
import { DeliveryPayment }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Delivery";
import { CreateEvent } from "@daml/ledger";

export default function DeliveryPayments() {

  const ledger = useLedger();
  const payments = useStreamQuery(DeliveryPayment);

  function accept(
            createEvent : CreateEvent<DeliveryPayment>,
            _unused : any) {
    ledger.exercise(
      DeliveryPayment.DeliveryPayment_Accept,
      createEvent.contractId,
      {});
  };

  return (
    <>
      <div>
      <Contracts
        contracts={payments.contracts}
        columns={[
          { name: "Workflow ID", path: "payload.workflowId" },
          { name: "Supplier", path: "payload.supplier" },
          { name: "Seller", path: "payload.seller" },
        ]}
        actions={[
          {
            name: "Accept",
            handle: accept,
            paramName: "",
            condition: (c) => true,
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
