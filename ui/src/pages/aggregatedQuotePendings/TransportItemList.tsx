/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { AggregatedQuotePending }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Aggregate";
import { DialogTitle, DialogContent, Dialog, DialogActions,
         Grid, TextField, Button } from "@material-ui/core";
import Ledger, { CreateEvent } from "@daml/ledger";

export function TransportItemList(
    props:
      {
        ledger: Ledger,
        createEvent: CreateEvent<AggregatedQuotePending, unknown, string> | undefined,
        isDialogOpen: boolean,
        setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
      }) {
    const fields = props.createEvent === undefined ? [] : props.createEvent.payload.items

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
                  key={"pickUpDate" + i}
                  type="date"
                  name="pickUpDate"
                  label="Pickup date"
                  value={field._1._1.pickUpDate}
                  disabled={true}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"deliveryDate" + i}
                  type="date"
                  name="deliveryDate"
                  label="Delivery date"
                  value={field._1._1.deliveryDate}
                  disabled={true}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"transportCompany" + i}
                  type="text"
                  name="transportCompany"
                  label="Transport company"
                  value={field._1._1.transportCompany}
                  disabled={true}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"price" + i}
                  type="number"
                  name="price"
                  label="Price"
                  value={field._1._2}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"productName" + i}
                  type="string"
                  name="productName"
                  label="Product name"
                  value={field._1._1.warehouseProduct.productName}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"quantity" + i}
                  type="string"
                  name="quantity"
                  label="Quantity"
                  value={field._1._1.warehouseProduct.quantity}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"warehouse" + i}
                  type="string"
                  name="warehouse"
                  label="Warehouse"
                  value={field._1._1.warehouseProduct.warehouse}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"warehouseAddress" + i}
                  type="string"
                  name="warehouseAddress"
                  label="Warehouse address"
                  value={field._1._1.warehouseProduct.warehouseAddress}
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
