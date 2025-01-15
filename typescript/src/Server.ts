abstract class BaseServer {
  private port: number;
  private address: string;

  // we can use the constructor to initialize the properties and their access modifiers
  constructor(port: number, address: string) {
    this.port = port;
    this.address = address;
  }

  startServer() {
    console.log(`Server started at ${this.address}:${this.port}`);
  }

  abstract stopServer(): void;
}
class DbServer extends BaseServer {
  constructor(port: number, address: string) {
    super(port, address);
    console.log("Calling db server constructor");
  }

  // we need to implement the abstract method
  stopServer(): void {
    console.log("Stopping server");
  }
}

const someServer = new DbServer(3000, "localhost");
someServer.startServer();

// private override
const somePort = (someServer as any).port;

// cannot create an instance of an abstract class
// const someOtherServer = new BaseServer(3000, "localhost");
