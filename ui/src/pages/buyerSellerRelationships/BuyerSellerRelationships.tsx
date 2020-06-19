/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { DialogTitle, DialogContent, Dialog, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Grid, Table,
  TableHead, TableRow, TableCell, TableBody, TextField,
  Button, Tooltip } from "@material-ui/core";
import { useState } from "react";
import Contracts from "../../components/Contracts/Contracts";
import { useLedger, useStreamQuery } from "@daml/react";
import { BuyerSellerRelationship, BuyerSellerRelationship_SendQuoteRequest }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Relationship";
import { CreateEvent } from "@daml/ledger";
import { OrderedProduct } from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Types/module";

export default function BuyerSellerRelationships() {

  const [isDialogOpen, setDialogIsOpen] = useState(false);
  const [createEvent, setCreateEvent] = useState(undefined as CreateEvent<BuyerSellerRelationship> | undefined);
  const [fields, setFields] = useState([] as OrderedProduct[]);

  const ledger = useLedger();
  const roles =
    useStreamQuery(BuyerSellerRelationship);

  function sendQuoteRequest() {
    if (createEvent !== undefined) {
      const parameters: BuyerSellerRelationship_SendQuoteRequest = {
        "products": fields
      }
      ledger.exercise(
        BuyerSellerRelationship.BuyerSellerRelationship_SendQuoteRequest,
        createEvent.contractId,
        parameters);
      setDialogIsOpen(false);
    } else {
      console.error("Create event is undefined!");
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
    console.log("--------------------------------");
    console.log(values);
    values.splice(i, 1);
    console.log(values);
    setFields(values);
  }

  function showQuoteRequestDialog(
            createEvent : CreateEvent<BuyerSellerRelationship>,
            _unused : any) {
    setDialogIsOpen(true);
    setCreateEvent(createEvent);
  };

  return (
    <>
      <div>
      <Dialog open={isDialogOpen} key="quoteReq" onClose={() => ({})} maxWidth="sm" fullWidth>
        <DialogTitle>
          Quote request
        </DialogTitle>
        <DialogContent>
          <Grid>
          <form>
            { fields.map((field, i) => {
              return (
                <>
                  <TextField
                    required
                    autoFocus
                    fullWidth={true}
                    key={"productName" + i}
                    type="text"
                    name="productName"
                    label="Product name"
                    value={field.productName}
                    onChange={(event) => handleChangeInput(i, event) }
                  />
                  <TextField
                    required
                    autoFocus
                    fullWidth={true}
                    key={"quantity" + i}
                    type="number"
                    name="quantity"
                    label="Quantity"
                    value={field.quantity}
                    onChange={(event) => handleChangeInput(i, event) }
                  />
                  <TextField
                    required
                    autoFocus
                    fullWidth={true}
                    key={"deliveryFrom" + i}
                    type="date"
                    name="deliveryFrom"
                    label="Delivery from"
                    value={field.deliveryFrom}
                    InputLabelProps={{ shrink: true }}
                    onChange={(event) => handleChangeInput(i, event) }
                  />
                  <TextField
                    required
                    autoFocus
                    fullWidth={true}
                    key={"deliveryTo" + i}
                    type="date"
                    name="deliveryTo"
                    label="Delivery to"
                    value={field.deliveryTo}
                    InputLabelProps={{ shrink: true }}
                    onChange={(event) => handleChangeInput(i, event) }
                  />
                  <Button key={"minus" + i} onClick={() => handleRemoveInput(i)}>−</Button>
                </>);
            }) }
          <Button key="plus" onClick={() => handleAddInput()}>{ (fields.length === 0) ? "+ Add" : "+" }</Button>
          </form>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button key="cancel" onClick={() => setDialogIsOpen(false) } color="primary">
            Cancel
          </Button>
          <Button key="okay" onClick={() => sendQuoteRequest() } color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
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
