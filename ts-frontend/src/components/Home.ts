export class Home {
  private container = document.createElement("div");
  render() {
    const pageLabel = document.createElement("label");
    pageLabel.textContent = "Welcome to the home page!!";
    this.container.append(pageLabel);
    return this.container;
  }
}
