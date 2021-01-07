/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { QuoteRequest }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/QuoteRequest";
import { DialogTitle, DialogContent, Dialog, DialogActions,
         Grid, TextField, Button } from "@material-ui/core";
import Ledger, { CreateEvent } from "@daml/ledger";

export function OrderedProductList(
    props:
      {
        ledger: Ledger,
        createEvent: CreateEvent<QuoteRequest, unknown, string> | undefined,
        isDialogOpen: boolean,
        setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
      }) {
    const fields = props.createEvent ? props.createEvent.payload.products : []

    return (
      <Dialog open={props.isDialogOpen} key="quoteReq" onClose={() => ({})} maxWidth={false} fullWidth>
      <DialogTitle>
        Quote request {props.createEvent ? `(Ordered by ${props.createEvent.payload.buyer})` : ""}
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
                  disabled={true}
                  fullWidth
                />
                </Grid>
                <Grid item xs={3}>
                <TextField
                  required
                  autoFocus
                  key={"quantity" + i}
                  type="number"
                  name="quantity"
                  label="Quantity"
                  value={field.quantity}
                  disabled={true}
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
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
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
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                </Grid>
              </Grid>);
          }) }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button key="cancel" onClick={() => props.setDialogOpen(false) } color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>);
  }
