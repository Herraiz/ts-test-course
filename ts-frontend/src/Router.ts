import { Home } from "./components/Home";
import { Login } from "./components/Login";

export class Router {
private mainElement = document.getElementById("main-container");

constructor() {
    // Listen for back/forward button clicks
    window.addEventListener('popstate', () => {
    this.handleRequest();
    });
}

private getRoute() {
    return window.location.pathname;
  }
public navigateTo(path: string) {
// Update the URL without page reload
window.history.pushState({}, '', path);
this.handleRequest();
}

public handleRequest() {
const location = this.getRoute();
console.log("Location is: ", location);

// Clear existing content
if (this.mainElement) {
    this.mainElement.innerHTML = '';
}

switch (location) {
      case "/login":
        this.mainElement?.append(new Login().render());
        break;

      default:
        this.mainElement?.append(new Home().render());
        break;
    }
  }
}
