import { useState } from "react";
import { Menu } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";

import FamilyPage from "./pages/Family/FamilyPage";
import FoodsPage from "./pages/Foods/FoodsPage";

const pages = {
  family: {
    icon: "users",
    name: "Familj",
    render: () => <FamilyPage />,
  },
  foods: {
    icon: "food",
    name: "Mat",
    render: () => <FoodsPage />,
  },
};

type Page = keyof typeof pages;

const App: React.FC = function App() {
  const [page, go] = useState<Page>("foods");

  return (
    <div
      className="App"
      style={{
        height: "100vh",
        display: "flex",
      }}
    >
      <div style={{ flex: "0 0 auto", height: "100%", overflow: "overflow" }}>
        <Menu style={{ height: "100%" }} vertical borderless fluid>
          {Object.entries(pages).map(([key, def]) => (
            <Menu.Item
              key={key}
              icon={def.icon}
              name={def.name}
              active={page === key}
              onClick={() => go(key as Page)}
            />
          ))}
          {/* <FamilyMenuItem state={state} />
            <Menu.Item fitted>
              <AddFoodSearch state={state} size="small" />
            </Menu.Item>
            <Menu.Item>
              <SelectedFoods state={state} />
            </Menu.Item> */}
        </Menu>
      </div>
      <div
        style={{
          flex: "1 1 auto",
          padding: "1em",
          overflowY: "scroll",
          height: "100%",
        }}
      >
        {pages[page].render()}
      </div>
    </div>
  );
};

export default App;
