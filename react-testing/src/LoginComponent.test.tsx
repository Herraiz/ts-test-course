import { render, screen } from "@testing-library/react";
import LoginComponent from "./LoginComponent";

describe("Login Component tests", () => {
  const loginServiceMock = {
    login: jest.fn(),
  };
  const setTokenMock = jest.fn();

  test("Should render correctly login component", () => {
    const container = render(
      <LoginComponent loginService={loginServiceMock} setToken={setTokenMock} />
    ).container;
    console.log(container.innerHTML);
    console.log(container.textContent);
    console.log(container.outerHTML);

    // Screen by react-testing allow us to query elements rendered by react
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
  });
});
