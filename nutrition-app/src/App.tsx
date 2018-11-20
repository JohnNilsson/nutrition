import * as React from "react";

import TopMenu from "./components/TopMenu";
// import NutritionStats from "./components/NurtitionStats";
// import SelectedFoods from "./components/SelectedFoods";

import { AutoSizer, Grid, GridCellProps } from 'react-virtualized'
import {Naringsvarde} from "swedish-food-composition-database/src/XmlTo6NFTransform";

class NutritionTable extends React.Component<{},{db:Naringsvarde|null}>
{
  constructor(props: {})
  {
    super(props);
    this.state = {db:null};
    this.loadDb().then(db => {
      this.setState({db});
    });
  }

  private async loadDb()
  {
    const db = await import("swedish-food-composition-database/data/Naringsvarde.6NF.json");
    console.log(db.default);
    return db.default;
  }

  render() {
    const {db} = this.state;
    return (db === null)
    ? <div />
    : <AutoSizer>
      {({ height, width }) => (
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
          rowHeight={50}
          width={width}
        />
      )}
      </AutoSizer>;
  }
}




import "semantic-ui-css/semantic.min.css";
import { FlexDirectionProperty } from "csstype";
import { Component } from "react";

const appStyle = {
  height: "100vh"
};

const floxColStyles = {
  height: "100%",
  display: "flex",
  flexDirection: "column" as FlexDirectionProperty
};

const FlexCol: React.FunctionComponent
= ({ children }) => <div style={floxColStyles}>{children}</div>;

const flexColItemStyle = {
  flex: "1"
};

const FlexColItem: React.FunctionComponent
= ({ children }) => (
  <div style={flexColItemStyle}>{children}</div>
);

const App = () => (
  <div className="App" style={appStyle}>
    <React.StrictMode>
      <TopMenu />
      <FlexCol>
        <FlexColItem>
          <NutritionTable />
          {/* <SelectedFoods /> */}
          {/* <NutritionStats /> */}
        </FlexColItem>
      </FlexCol>
    </React.StrictMode>
  </div>
);

export default App;
