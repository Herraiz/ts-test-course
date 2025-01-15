let bcd = undefined;
const def = null;

function getData(): string | undefined {
  const data = getData();

  if (data) {
    const someOtherData = data;
    return data;
  }
}

let input: unknown;
input = "someInput";

let someSensitiveValue: string;
// someSensitiveValue = input; // we cannot make this

if (typeof input === "string") {
  someSensitiveValue = input;
}

console.log(someSensitiveValue!);

function doTasks(tasks: number): void | never {
  if (tasks > 3) {
    throw new Error("Task is too big");
  }
}

const stuff = doTasks(2);
