class Server {
  port: number;
  addess: string;

  constructor(port: number, address: string) {
    this.port = port;
    this.addess = address;
  }

  startServer() {
    console.log(`Server started at ${this.addess}:${this.port}`);
  }
}

const someServer = new Server(3000, "localhost");
someServer.startServer();
