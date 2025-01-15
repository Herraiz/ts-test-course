/* eslint-disable testing-library/no-node-access */
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

  //  Async tests

  test("Right credentials - successfull login", async () => {
    loginServiceMock.login.mockResolvedValueOnce("1234");

    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(3);
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(userNameInput, { target: { value: "user" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(loginButton);

    // This will not work. The value is not updated because of the await login
    // const resultLabel = screen.getByTestId("resultLabel");

    // We need to use await findByTestId
    const resultLabel = await screen.findByTestId("resultLabel");
    expect(resultLabel).toHaveTextContent("successful login");
  });

  test("Right credentials - successfull login with user calls", async () => {
    loginServiceMock.login.mockResolvedValueOnce("1234");

    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(3);
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    act(() => {
      user.click(userNameInput);
      user.keyboard("user");
      user.click(passwordInput);
      user.keyboard("password");
      user.click(loginButton);
    });

    expect(loginServiceMock.login).toHaveBeenCalledWith("user", "password");
    const resultLabel = await screen.findByTestId("resultLabel");
    expect(resultLabel).toHaveTextContent("successful login");
  });

  test("Wrong credentials - unsuccessfull login", async () => {
    loginServiceMock.login.mockResolvedValueOnce(undefined);

    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(3);
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(userNameInput, { target: { value: "user" } });
    fireEvent.change(passwordInput, { target: { value: "jaja" } });
    fireEvent.click(loginButton);

    const resultLabel = await screen.findByTestId("resultLabel");
    expect(resultLabel).toHaveTextContent("invalid credentials");
  });

  test("Wrong credentials - unsuccessfull login - solve act warnings", async () => {
    const result = Promise.resolve(undefined);
    loginServiceMock.login.mockResolvedValueOnce(result);

    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(3);
    const userNameInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    act(() => {
      user.click(userNameInput);
      user.keyboard("user");
      user.click(passwordInput);
      user.keyboard("jaja");
      user.click(loginButton);
    });

    await result;
    const resultLabel = await screen.findByTestId("resultLabel");
    expect(resultLabel).toHaveTextContent("invalid credentials");
  });
});
