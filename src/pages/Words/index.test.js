import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import Words from "./index";

it("renders without crashing", () => {
  const component = render(<Words />);
});

it("rendering base element", () => {
  const component = render(<Words />);
  const baseElement = component.baseElement;
  expect(baseElement).toBeInTheDocument();
});
