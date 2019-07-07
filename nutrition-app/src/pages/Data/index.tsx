import React from "react";
import { observer } from "mobx-react-lite";
import { fromPromise } from "mobx-utils";

import {
  VariableSizeGrid as Grid,
  GridChildComponentProps
} from "react-window";

import AutoSizer from "react-virtualized-auto-sizer";

import dbPromise, { Db } from "../../services/FoodData";

interface NutritionTableProps {
  db: Db;
}
function NutritionTable({ db }: NutritionTableProps) {
  if (db == null) {
    return <div>Loading...</div>;
  }
  const nutrientName = db.Naringsamne.Namn;
  const foodName = db.Livsmedel.Namn;
  const foodNutrients = db.Livsmedel.Naringsvarde;
  const nutrientKey = db.Naringsamne.Forkortning;

  const headerData = (columnIndex: number) =>
    columnIndex === 0 ? "Name" : nutrientName[columnIndex - 1];

  const rowData = (rowIndex: number, columnIndex: number) =>
    columnIndex === 0
      ? foodName[rowIndex - 1]
      : foodNutrients[nutrientKey[columnIndex - 1]].Varde[rowIndex - 1];

  const cellData = (rowIndex: number, columnIndex: number) =>
    rowIndex === 0 ? headerData(columnIndex) : rowData(rowIndex, columnIndex);

  const Cell = ({ columnIndex, rowIndex, style }: GridChildComponentProps) => (
    <div style={style}>{cellData(rowIndex, columnIndex)}</div>
  );

  const columnCount = 1 + nutrientName.length;
  const rowCount = 1 + foodName.length;

  const rowHeight = (index: number) => (index === 0 ? 60 : 20);
  const columnWidth = (index: number) => (index === 0 ? 500 : 100);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={height}
          rowCount={rowCount}
          rowHeight={rowHeight}
          width={width}
        >
          {Cell}
        </Grid>
      )}
    </AutoSizer>
  );
}

const dbPromiseObservable = fromPromise(dbPromise);

const NutritionTableLoader = observer(function NutritionTableLoader() {
  return dbPromiseObservable.case({
    fulfilled: db => <NutritionTable db={db} />,
    pending: () => <div>Loading...</div>,
    rejected: err => <div>{err.message}</div>
  });
});

export default NutritionTableLoader;
