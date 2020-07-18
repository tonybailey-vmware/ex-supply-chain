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

export function SingleWarehouseProductWithDates(
    props:
      {
        ledger: Ledger,
        item: WarehouseProductWithDates | undefined,
        isDialogOpen: boolean,
        setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
      }) {

    return (
      <Dialog open={props.isDialogOpen} key="transportQuotReqItem" onClose={() => ({})} maxWidth={false} fullWidth>
      <DialogTitle>
        Item
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          { props.item ?
            (
              <Grid container item spacing={3} xs={12}>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"deliveryFrom"}
                  type="date"
                  name="deliveryFrom"
                  label="Delivery From"
                  value={props.item.deliveryFrom}
                  disabled={true}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"deliveryTo"}
                  type="date"
                  name="deliveryTo"
                  label="Delivery To"
                  value={props.item.deliveryTo}
                  disabled={true}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"productName"}
                  type="string"
                  name="productName"
                  label="Product name"
                  value={props.item.warehouseProduct.productName}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"quantity"}
                  type="string"
                  name="quantity"
                  label="Quantity"
                  value={props.item.warehouseProduct.quantity}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"warehouse"}
                  type="string"
                  name="warehouse"
                  label="Warehouse"
                  value={props.item.warehouseProduct.warehouse}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                </Grid>
                <Grid item xs>
                <TextField
                  required
                  autoFocus
                  key={"warehouseAddress"}
                  type="string"
                  name="warehouseAddress"
                  label="Warehouse address"
                  value={props.item.warehouseProduct.warehouseAddress}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                </Grid>
              </Grid>
            )
            : <Grid/>
          }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button key="cancel" onClick={() => props.setDialogOpen(false) } color="primary">
          Okay
        </Button>
      </DialogActions>
    </Dialog>);
  }
