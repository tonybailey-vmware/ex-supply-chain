/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger } from "@daml/react";
import { DeliverySupplierPayment }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Delivery";
import { CreateEvent } from "@daml/ledger";

export default function SupplierPayments() {

  const ledger = useLedger();
  const payments = useStreamQuery(DeliverySupplierPayment);

  function pay(
            createEvent : CreateEvent<DeliverySupplierPayment>,
            _unused : any) {
    ledger.exercise(
      DeliverySupplierPayment.DeliverySupplierPayment_Pay,
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
          { name: "Transport Company", path: "payload.transportCompany" },
        ]}
        actions={[
          {
            name: "Pay",
            handle: pay,
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
