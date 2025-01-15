function returnKeys<T extends Object>(arg: T) {
  console.log(Object.keys(arg));
  return arg;
}

const a = returnKeys({ a: 1, b: 2 });

interface NewPerson<T> {
  name: string;
  age: number;
  special: T;
}

const john: NewPerson<string> = {
  special: "Engineer",
  name: "john",
  age: 25,
};

class Observable<T extends NewPerson<string>> {
  subscribe(arg: T): void {
    console.log(`Subscribed to ${arg.name}`);
  }
}

new Observable<typeof john>().subscribe(john);
