interface IServer {
  startServer(): void;
  stopServer(): void;
}

class Server implements IServer {
  public port: number;
  public address: string;

  constructor(port: number, address: string) {
    this.port = port;
    this.address = address;
  }

  startServer() {
    console.log(`Server started at ${this.address}:${this.port}`);
  }

  stopServer(): void {}
}

const someServer: IServer = new Server(3000, "localhost");
someServer.startServer();
// we cannot access the port and address properties of someServer, because is not implemented in the interface
