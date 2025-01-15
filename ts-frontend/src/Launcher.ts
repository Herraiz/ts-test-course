import { Router } from "./Router";

class Launcher {
  private router: Router = new Router();

  public launchApp() {
    console.log("Launching app");
    this.router.handleRequest();
  }
}
new Launcher().launchApp();
