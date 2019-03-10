import React from "react";

import {
  AutoSizer,
  MultiGrid,
  GridCellRenderer,
  Index
} from "react-virtualized";

import db from "swedish-food-composition-database/data/Naringsvarde.6NF.json";

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
  rowIndex == 0 ? headerData(columnIndex) : rowData(rowIndex, columnIndex);

const cellRenderer: GridCellRenderer = ({
  rowIndex,
  columnIndex,
  key,
  style
}) => (
  <div key={key} style={style}>
    {cellData(rowIndex, columnIndex)}
  </div>
);

const columnCount = 1 + nutrientName.length;
const rowCount = 1 + foodName.length;

const rowHeight = ({ index }: Index) => (index === 0 ? 60 : 20);
const estimatedRowSize = 60 + (columnCount - 1) * 20;

const columnWidth = ({ index }: Index) => (index === 0 ? 500 : 100);
const estimatedColumnSize = 500 + (columnCount - 1) * 100;

export default () => (
  <AutoSizer>
    {({ height, width }) => (
      <MultiGrid
        cellRenderer={cellRenderer}
        columnCount={columnCount}
        columnWidth={columnWidth}
        estimatedColumnSize={estimatedColumnSize}
        fixedColumnCount={1}
        fixedRowCount={1}
        height={height}
        rowCount={rowCount}
        rowHeight={rowHeight}
        estimatedRowSize={estimatedRowSize}
        width={width}
      />
    )}
  </AutoSizer>
);
