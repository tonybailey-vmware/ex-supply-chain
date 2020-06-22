/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery, useParty, useLedger } from "@daml/react";
import { QuoteRequest }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/QuoteRequest";
import { CreateEvent } from "@daml/ledger";

export default function QuoteRequests() {

  const party = useParty();
  const ledger = useLedger();
  const roles =
    useStreamQuery(QuoteRequest);

  function acceptQuoteRequest(
            createEvent : CreateEvent<QuoteRequest>,
            workflowId : string) {
    ledger.exercise(
      QuoteRequest.QuoteRequest_Accept,
      createEvent.contractId,
      { workflowId: workflowId });
  };

  return (
    <>
      <div>
      <Contracts
        contracts={roles.contracts}
        columns={[
          { name: "Buyer", path: "payload.buyer" },
          { name: "Buyer Address", path: "payload.buyerAddress" },
          { name: "Seller", path: "payload.seller" },
        ]}
        actions={[
          {
            name: "Accept",
            handle: acceptQuoteRequest,
            paramName: "Workflow Id",
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
