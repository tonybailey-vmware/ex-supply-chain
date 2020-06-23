/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useParty, useLedger } from "@daml/react";
import { PricedWarehouseProduct }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Types";
import { QuoteForBuyer }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Quote";
import { useState } from "react";
import { CreateEvent } from "@daml/ledger";
import { PricedWarehouseProductList } from "../aggregatedQuotes/PricedWarehouseProductList";

export default function QuoteForBuyerView() {

  const party = useParty();
  const ledger = useLedger();
  const roles =
    useStreamQuery(QuoteForBuyer);

  function acceptQuoteForBuyer(
            createEvent : CreateEvent<QuoteForBuyer>,
            _unused : any) {
    ledger.exercise(
      QuoteForBuyer.QuoteForBuyer_Accept,
      createEvent.contractId,
      { });
  };

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [items, setItems] = useState(undefined as PricedWarehouseProduct[] | undefined);

  function showOrderedProductListDialog(
            createEvent : CreateEvent<QuoteForBuyer>,
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
          { name: "Buyer Address", path: "payload.buyerAddress" },
          { name: "Seller", path: "payload.seller" },
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
            handle: acceptQuoteForBuyer,
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
