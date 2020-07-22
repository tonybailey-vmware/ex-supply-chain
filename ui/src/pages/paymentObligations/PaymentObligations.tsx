/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery } from "@daml/react";
import { PaymentObligation } from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Payment/module";

export default function PaymentObligations() {
  const obligations = useStreamQuery(PaymentObligation);

  return (
    <>
      <div>
      <Contracts
        contracts={obligations.contracts}
        columns={[
          { name: "Payer", path: "payload.payer" },
          { name: "Payee", path: "payload.payee" },
          { name: "Price", path: "payload.price" },
        ]}
        actions={[]}
        dialogs={[]}
      />
      </div>
    </>
  );
}
