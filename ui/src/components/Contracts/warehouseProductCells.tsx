import React from "react";
import { WarehouseProduct } from "@daml.js/supplychain-1.0.0/lib/DA/RefApps/SupplyChain/Types";
import { Grid, TextField } from "@material-ui/core";

export function warehouseProductCells(warehouseProduct: WarehouseProduct, id: number = 0) {
  return [
    <Grid item xs>
      <TextField
        required
        autoFocus
        key={"productName" + id}
        type="string"
        name="productName"
        label="Product name"
        value={warehouseProduct.productName}
        disabled={true}
        InputLabelProps={{ shrink: true }}
        fullWidth />
    </Grid>,
    <Grid item xs>
      <TextField
        required
        autoFocus
        key={"quantity" + id}
        type="string"
        name="quantity"
        label="Quantity"
        value={warehouseProduct.quantity}
        disabled={true}
        InputLabelProps={{ shrink: true }}
        fullWidth />
    </Grid>,
    <Grid item xs>
      <TextField
        required
        autoFocus
        key={"warehouse" + id}
        type="string"
        name="warehouse"
        label="Warehouse"
        value={warehouseProduct.warehouse}
        disabled={true}
        InputLabelProps={{ shrink: true }}
        fullWidth />
    </Grid>,
    <Grid item xs>
      <TextField
        required
        autoFocus
        key={"warehouseAddress" + id}
        type="string"
        name="warehouseAddress"
        label="Warehouse address"
        value={warehouseProduct.warehouseAddress}
        disabled={true}
        InputLabelProps={{ shrink: true }}
        fullWidth />
    </Grid>
  ];
}
