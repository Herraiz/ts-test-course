// import { Comp1 as someComponent } from "@components/Comp1";
import { Comp1 as someComponent } from "./data/components/Comp1";
// import * as Comp from "./data/components/Comp1";

function logInvocation(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const className = target.constructor.name; // which class called the method
  let originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    console.log(
      `${className}#${propertyKey} called with ${JSON.stringify(args)}`
    );
    const result = await originalMethod.apply(this, args);
    console.log(
      `${className}#${propertyKey} returned ${JSON.stringify(result)}`
    );
  };
}

export interface IServer {
  startServer(): void;
  stopServer(): void;
}

class Server implements IServer {
  public port: number;
  public address: string;
  public comp1 = new someComponent();
  public date: string = "";

  constructor(port: number, address: string) {
    this.port = port;
    this.address = address;
    this.date = "";
  }

  async startServer() {
    const data = await this.getData(123);
    console.log(`Server started at ${this.address}:${this.port}`);
    return function () {
      // this.date = 5;
    };
  }

  stopServer(): void {}

  // Promises, need await to use them and transform functions to async if they use it
  @logInvocation
  async getData(id: number): Promise<string> {
    return "some special data";
  }
}

const someServer: IServer = new Server(3000, "localhost");
someServer.startServer();
// we cannot access the port and address properties of someServer, because is not implemented in the interface
