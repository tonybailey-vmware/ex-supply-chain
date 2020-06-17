import React from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useStreamQuery } from "@daml/react";
import { BuyerSellerRelationship } from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Relationship";

export default function ValidEmission() {

  const roles =
    useStreamQuery(BuyerSellerRelationship);

  return (
    <>
      <Contracts
        contracts={roles.contracts}
        columns={[
          { name: "Company name", path: "payload.company" },
          { name: "Amount", path: "payload.amount" },
          { name: "Auditor", path: "payload.auditor" },
          { name: "Year", path: "payload.year" },
          { name: "Quarter", path: "payload.quarter" },
        ]}
        actions={[]}
        dialogs={[]}
      />
    </>
  );
}
