import ReactDOM from "react-dom/client";
import App from "./App2";
import LoginComponent from "./LoginComponent";
import LoginService from "./services/LoginService";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const loginService = new LoginService();
const setToken = (token: string) => {
  console.log(`Token set: ${token}`);
};
root.render(<LoginComponent loginService={loginService} setToken={setToken} />);
