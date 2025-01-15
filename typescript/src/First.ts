interface Person {
  firstName: string;
  lastName: string;
  job?: job;
  isVisitor?: boolean;
}

type job = "Engineer" | "Programmer";

function generateEmail(input: Person, force?: boolean): string | undefined {
  if (input.isVisitor && !force) {
    return undefined;
  } else {
    return `${input.firstName.toLowerCase()}.${input.lastName.toLowerCase()}@email.com`;
  }
}

const abc: string | undefined = generateEmail({} as any);

function toUpperCase(arg: string) {}

toUpperCase(abc!); // stric null check, we are sure that abc is not null

const person: Person = {
  firstName: "John",
  lastName: "Doe",
};

// console.log(
//   generateEmail(
//     {
//       firstName: "John",
//       lastName: "Doe",
//       // job: "Ewqdqdqwd",
//       job: "Engineer",
//       isVisitor: true,
//     },
//     true
//   )
// );

// Type guards

function isPerson(potentialPerson: any): boolean {
  if ("firstName" in potentialPerson && "lastName" in potentialPerson) {
    return true;
  } else {
    return false;
  }
}

function printEmailIfPerson(potentialPerson: any): void {
  if (isPerson(potentialPerson)) {
    console.log(generateEmail(potentialPerson));
  } else {
    console.log("Not a person");
  }
}

printEmailIfPerson(person);

async function someAsycn() {
  return "async";
}
