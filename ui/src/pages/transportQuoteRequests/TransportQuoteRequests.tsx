/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts, { field, date, number } from "../../components/Contracts/Contracts";
import { useStreamQuery, useLedger } from "@daml/react";
import { TransportQuoteRequest }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/QuoteRequest";
import { CreateEvent } from "@daml/ledger";

export default function TransportQuoteRequests() {

  const ledger = useLedger();
  const roles =
    useStreamQuery(TransportQuoteRequest);

  const transportableQuantity = "Transportable quantity"
  const price = "Price"
  const pickUpDate = "Pickup date"
  const deliveryDate = "Delivery date"
  function acceptTransportQuoteRequest(
            createEvent : CreateEvent<TransportQuoteRequest>,
            parameters : any) {
    ledger.exercise(
      TransportQuoteRequest.TransportQuoteRequest_Accept,
      createEvent.contractId,
      {
        quoteItem: {
          transportableQuantity: parameters[transportableQuantity],
          price: parameters[price],
          pickUpDate: parameters[pickUpDate],
          deliveryDate: parameters[deliveryDate]
        }
      });
  };

  return (
    <>
      <div>
      <Contracts
        contracts={roles.contracts}
        columns={[
          { name: "Workflow ID", path: "payload.workflowId" },
          { name: "Transport company", path: "payload.transportCompany" },
          { name: "Buyer", path: "payload.buyer" },
          { name: "Buyer Address", path: "payload.buyerAddress" },
          { name: "Supplier", path: "payload.supplier" },
        ]}
        actions={[]}
        dialogs={[
          {
            name: "Accept",
            dialogFields: [
              field(transportableQuantity, number),
              field(price, number),
              field(pickUpDate, date),
              field(deliveryDate, date),
            ],
            action: acceptTransportQuoteRequest,
          },
        ]}
      />
      </div>
    </>
  );
}
