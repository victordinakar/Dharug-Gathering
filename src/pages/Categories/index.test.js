import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import Categories from "./index";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Categories />, div);
  ReactDOM.unmountComponentAtNode(div);
});
