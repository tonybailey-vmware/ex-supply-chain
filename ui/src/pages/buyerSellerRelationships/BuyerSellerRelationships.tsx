/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { DialogTitle, DialogContent, Dialog, DialogActions,
         Grid, TextField, Button } from "@material-ui/core";
import { useState } from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useLedger, useStreamQuery } from "@daml/react";
import { BuyerSellerRelationship, BuyerSellerRelationship_SendQuoteRequest }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Relationship";
import Ledger, { CreateEvent } from "@daml/ledger";
import { OrderedProduct } from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Types/module";

function OrderedProductInput(
  props:
    {
      ledger: Ledger,
      createEvent: CreateEvent<BuyerSellerRelationship, unknown, string> | undefined,
      isDialogOpen: boolean,
      setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    }) {
  const [fields, setFields] = useState([] as OrderedProduct[]);

  function sendQuoteRequest() {
    if (props.createEvent !== undefined) {
      const parameters: BuyerSellerRelationship_SendQuoteRequest = {
        "products": fields
      }
      props.ledger.exercise(
        BuyerSellerRelationship.BuyerSellerRelationship_SendQuoteRequest,
        props.createEvent.contractId,
        parameters);
      props.setDialogOpen(false);
    } else {
      console.error("Unreachable: Create event is undefined!");
    }
  };

  function handleChangeInput(i: number, event: any) {
    const values: OrderedProduct[] = [...fields];
    const { name, value } = event.target;
    switch (name) {
      case "productName":
        values[i].productName = value;
        break;
      case "deliveryTo":
        values[i].deliveryTo = value;
        break;
      case "deliveryFrom":
        values[i].deliveryFrom = value;
        break;
      default:
        values[i].quantity = value;
        break;
    }
    setFields(values);
  }

  function handleAddInput() {
    const values = [...fields];
    values.push({
      productName: "",
      quantity: "",
      deliveryFrom: "",
      deliveryTo: "",
    });
    setFields(values);
  }

  function handleRemoveInput(i: number) {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
  }

  return (
    <Dialog open={props.isDialogOpen} key="quoteReq" onClose={() => ({})} maxWidth={false} fullWidth>
    <DialogTitle>
      Quote request
    </DialogTitle>
    <DialogContent>
      <Grid container spacing={3}>
        { fields.map((field, i) => {
          return (
            <Grid container item spacing={3} xs={12}>
              <Grid item xs>
              <TextField
                required
                autoFocus
                key={"productName" + i}
                type="text"
                name="productName"
                label="Product name"
                value={field.productName}
                onChange={(event) => handleChangeInput(i, event) }
                fullWidth
              />
              </Grid>
              <Grid item xs={2}>
              <TextField
                required
                autoFocus
                key={"quantity" + i}
                type="number"
                name="quantity"
                label="Quantity"
                value={field.quantity}
                onChange={(event) => handleChangeInput(i, event) }
                fullWidth
              />
              </Grid>
              <Grid item xs={2}>
              <TextField
                required
                autoFocus
                key={"deliveryFrom" + i}
                type="date"
                name="deliveryFrom"
                label="Delivery from"
                value={field.deliveryFrom}
                InputLabelProps={{ shrink: true }}
                onChange={(event) => handleChangeInput(i, event) }
                fullWidth
              />
              </Grid>
              <Grid item xs={2}>
              <TextField
                required
                autoFocus
                key={"deliveryTo" + i}
                type="date"
                name="deliveryTo"
                label="Delivery to"
                value={field.deliveryTo}
                InputLabelProps={{ shrink: true }}
                onChange={(event) => handleChangeInput(i, event) }
                fullWidth
              />
              </Grid>
              <Grid item xs={1}>
              <Button key={"minus" + i} onClick={() => handleRemoveInput(i)}>−</Button>
              </Grid>
            </Grid>);
        }) }
        <Button key="plus" onClick={() => handleAddInput()}>+ Add</Button>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button key="cancel" onClick={() => props.setDialogOpen(false) } color="primary">
        Cancel
      </Button>
      <Button key="okay" onClick={() => sendQuoteRequest() } color="primary">
        Okay
      </Button>
    </DialogActions>
  </Dialog>);
}

export default function BuyerSellerRelationships() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [createEvent, setCreateEvent] = useState(undefined as CreateEvent<BuyerSellerRelationship> | undefined);

  const ledger = useLedger();
  const roles =
    useStreamQuery(BuyerSellerRelationship);

  function showQuoteRequestDialog(
            createEvent : CreateEvent<BuyerSellerRelationship>,
            _unused : any) {
    setDialogOpen(true);
    setCreateEvent(createEvent);
  };

  return (
    <>
      <div>
      <OrderedProductInput ledger={ledger} createEvent={createEvent} isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} />
      <Contracts
        contracts={roles.contracts}
        columns={[
          { name: "Buyer", path: "payload.buyer" },
          { name: "Buyer Address", path: "payload.buyerAddress" },
          { name: "Seller", path: "payload.seller" },
        ]}
        actions={[
          {
            name: "Send quote request",
            handle: showQuoteRequestDialog,
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
