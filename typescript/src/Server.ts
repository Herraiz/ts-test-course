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

  async startServer() {
    const data = await this.getData();
    console.log(`Server started at ${this.address}:${this.port}`);
  }

  stopServer(): void {}

  // Promises, need await to use them and transform functions to async if they use it
  async getData(): Promise<string> {
    return "{}";
  }
}

const someServer: IServer = new Server(3000, "localhost");
someServer.startServer();
// we cannot access the port and address properties of someServer, because is not implemented in the interface
