/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { WarehouseProductWithDates }
  from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Types";
import { DialogTitle, DialogContent, Dialog, DialogActions,
         Grid, TextField, Button } from "@material-ui/core";
import Ledger from "@daml/ledger";

export function WarehouseProductWithDatesList(
    props:
      {
        ledger: Ledger,
        items: WarehouseProductWithDates[] | undefined,
        isDialogOpen: boolean,
        setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
      }) {
    const fields = props.items === undefined ? [] : props.items

    return (
      <Dialog open={props.isDialogOpen} key="transportQuotReqItem" onClose={() => ({})} maxWidth={false} fullWidth>
      <DialogTitle>
        Item
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
                  key={"deliveryFrom" + i}
                  type="date"
                  name="deliveryFrom"
                  label="Delivery From"
                  value={field.deliveryFrom}
                  disabled={true}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"deliveryTo" + i}
                  type="date"
                  name="deliveryTo"
                  label="Delivery To"
                  value={field.deliveryTo}
                  disabled={true}
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
                  value={field.warehouseProduct.productName}
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
                  value={field.warehouseProduct.quantity}
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
                  value={field.warehouseProduct.warehouse}
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
                  value={field.warehouseProduct.warehouseAddress}
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
