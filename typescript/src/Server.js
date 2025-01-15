var Server = /** @class */ (function () {
  function Server(port, address) {
    this.port = port;
    this.addess = address;
  }
  Server.prototype.startServer = function () {
    console.log(
      "Server started at ".concat(this.addess, ":").concat(this.port)
    );
  };
  return Server;
})();
var someServer = new Server(3000, "localhost");
someServer.startServer();
