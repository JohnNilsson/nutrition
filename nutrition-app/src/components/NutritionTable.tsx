import React from 'react';

import { AutoSizer, Grid } from 'react-virtualized'

import db from "swedish-food-composition-database/data/Naringsvarde.6NF.json";

export default () =>
<AutoSizer>{({ height, width }) => (
  <Grid
    cellRenderer={({ rowIndex, columnIndex, key, style }) =>
    <div key={key} style={style}>{
      rowIndex == 0
      ? (columnIndex === 0 ? "id" :
          columnIndex === 1 ? "name" :
          db.Naringsamne.Namn[columnIndex-2])
      : (columnIndex === 0 ? db.Livsmedel.Nummer[rowIndex-1] :
          columnIndex === 1 ? db.Livsmedel.Namn[rowIndex-1] :
          db.Livsmedel.Naringsvarde[db.Naringsamne.Forkortning[columnIndex-2]].Varde[rowIndex-1])
    }</div>}
    columnCount={db.Naringsamne.Forkortning.length + 2}
    columnWidth={100}
    height={height}
    rowCount={db.Livsmedel.Nummer.length + 1}
    rowHeight={20}
    width={width}
  />
)}</AutoSizer>;
