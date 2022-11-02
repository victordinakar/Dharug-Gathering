import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import WordsEdit from "./index";

it("renders without crashing", () => {
  const component = render(<WordsEdit />);
});
