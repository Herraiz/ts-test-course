export class Login {
  private container = document.createElement("div");
  render() {
    const pageLabel = document.createElement("label");
    pageLabel.textContent = "Welcome to the LOGIN page!!";
    this.container.append(pageLabel);
    return this.container;
  }
}
