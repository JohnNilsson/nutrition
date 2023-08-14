import { ParentComponent, createSignal } from "solid-js";
import appIcon from "./app-icon.png";
import {
  HiSolidBookmark,
  HiSolidCalendarDays,
  HiSolidChartPie,
  HiSolidCog8Tooth,
  HiSolidShoppingCart,
} from "solid-icons/hi";
import { IconTypes } from "solid-icons";

const NavLink: ParentComponent<{
  Icon: IconTypes;
  text: string;
  active: boolean;
  onClick?: () => void;
}> = (props) => {
  return (
    <a
      href="#"
      class={`traition-colors mt-6 flex items-center rounded-lg p-2 duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
        props.active
          ? "text-gray-800 dark:text-white"
          : "text-gray-600 dark:text-gray-400"
      }`}
      onClick={props.onClick}
    >
      <props.Icon class="h-6 w-6" />
      <span class="mx-4 text-lg font-normal">{props.text}</span>
    </a>
  );
};

function App() {
  const [page, setPage] = createSignal("overview");
  return (
    <>
      <nav class="z-10 hidden h-full border-r border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 lg:relative lg:inset-0 lg:flex lg:w-52 lg:flex-col">
        <header class="flex items-center justify-start">
          <img src={appIcon} class="mr-3 h-8" />
          <span class="whitespace-nowrap text-2xl font-semibold dark:text-white">
            Godsaker
          </span>
        </header>
        <NavLink
          Icon={HiSolidChartPie}
          text="Översikt"
          active={page() === "overview"}
          onClick={() => setPage("overview")}
        />
        <NavLink
          Icon={HiSolidCalendarDays}
          text="Måltider"
          active={page() === "meals"}
          onClick={() => setPage("meals")}
        />
        <NavLink
          Icon={HiSolidBookmark}
          text="Recept"
          active={page() === "recipes"}
          onClick={() => setPage("recipes")}
        />
        <NavLink
          Icon={HiSolidShoppingCart}
          text="Ingredienser"
          active={page() === "ingredients"}
          onClick={() => setPage("ingredients")}
        />
        <footer class="mb-0 mt-auto">
          <NavLink
            Icon={HiSolidCog8Tooth}
            text="Inställningar"
            active={page() === "settings"}
            onClick={() => setPage("settings")}
          />
        </footer>
      </nav>
      <main class="fixed top-0 z-0 h-full w-full overflow-scroll lg:pl-52">
        <div class="m-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-64">
            {page()}
          </div>
          <div class="h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-64"></div>
          <div class="h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-64"></div>
          <div class="h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-64"></div>
        </div>
        <div class="m-4 h-96 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div class="m-4 grid grid-cols-2 gap-4">
          <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-72"></div>
          <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-72"></div>
          <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-72"></div>
          <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-72"></div>
        </div>
        <div class="m-4 h-96 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div class="m-4 grid grid-cols-2 gap-4">
          <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-72"></div>
          <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-72"></div>
          <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-72"></div>
          <div class="h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 md:h-72"></div>
        </div>
      </main>
    </>
  );
}

export default App;
