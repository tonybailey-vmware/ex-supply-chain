/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useParty, useLedger } from "@daml/react";
import { PricedWarehouseProduct }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Types";
import { useState } from "react";
import { CreateEvent } from "@daml/ledger";
import { PricedWarehouseProductList } from "../aggregatedQuotes/PricedWarehouseProductList";
import { ConfirmedOrder } from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Order/module";

export default function Orders() {

  const party = useParty();
  const ledger = useLedger();
  const roles =
    useStreamQuery(ConfirmedOrder);

  function startDelivery(
            createEvent : CreateEvent<ConfirmedOrder>,
            _unused : any) {
    ledger.exercise(
      ConfirmedOrder.ConfirmedOrder_StartDelivery,
      createEvent.contractId,
      { });
  };

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [items, setItems] = useState(undefined as PricedWarehouseProduct[] | undefined);

  function showOrderedProductListDialog(
            createEvent : CreateEvent<ConfirmedOrder>,
            _unused : any) {
    setDialogOpen(true);
    setItems(createEvent.payload.items);
  };

  return (
    <>
      <div>
      <PricedWarehouseProductList ledger={ledger} items={items} isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} />
      <Contracts
        contracts={roles.contracts}
        columns={[
          { name: "Workflow ID", path: "payload.workflowId" },
          { name: "Buyer", path: "payload.buyer" },
          { name: "Seller", path: "payload.seller" },
          { name: "Total price", path: "payload.totalPrice" },
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
            name: "Start delivery",
            handle: startDelivery,
            paramName: "",
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
