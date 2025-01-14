import { act, fireEvent, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import LoginComponent from "./LoginComponent";

describe("Login Component tests", () => {
  const loginServiceMock = {
    login: jest.fn(),
  };
  const setTokenMock = jest.fn();

  let container: HTMLElement;

  function setup() {
    container = render(
      <LoginComponent loginService={loginServiceMock} setToken={setTokenMock} />
    ).container;
  }

  beforeEach(() => {
    // container = render(
    //   <LoginComponent loginService={loginServiceMock} setToken={setTokenMock} />
    // ).container;
    setup();
  });

  test("Should render correctly login component", () => {
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();

    expect(screen.queryByTestId("resultLabel")).not.toBeInTheDocument();
  });

  test("Should render correctly - query by test id", () => {
    const inputs = screen.getAllByTestId("input");
    expect(inputs).toHaveLength(3);
    expect(inputs[0].getAttribute("value")).toBe("");
    expect(inputs[1].getAttribute("value")).toBe("");
    expect(inputs[2].getAttribute("value")).toBe("Login");
  });

  test("Should render correctly - query by document query", () => {
    // eslint-disable-next-line testing-library/no-node-access
    const inputs = container.querySelectorAll("input");
    // const inputs = document.querySelectorAll("input");

    expect(inputs).toHaveLength(3);
    expect(inputs[0].getAttribute("value")).toBe("");
    expect(inputs[1].getAttribute("value")).toBe("");
    expect(inputs[2].getAttribute("value")).toBe("Login");
  });

  test("Click login button with incomplete credentials - show required message - with fireEvent", () => {
    const inputs = screen.getAllByTestId("input");
    const loginButton = inputs[2];

    fireEvent.click(loginButton);

    const resultLabel = screen.getByTestId("resultLabel");

    expect(resultLabel).toHaveTextContent("UserName and password required!");
  });

  test("Click login button with incomplete credentials - show required message - with user click", () => {
    const inputs = screen.getAllByTestId("input");
    const loginButton = inputs[2];

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      user.click(loginButton);
    });

    const resultLabel = screen.getByTestId("resultLabel");

    expect(resultLabel).toHaveTextContent("UserName and password required!");
  });
});
