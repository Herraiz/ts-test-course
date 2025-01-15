interface Person {
  firstName: string;
  lasName: string;
  job?: job;
  isVisitor?: boolean;
}

type job = "Engineer" | "Programmer";

function generateEmail(input: Person, force?: boolean): string | undefined {
  if (input.isVisitor && !force) {
    return undefined;
  } else {
    return `${input.firstName.toLowerCase()}.${input.lasName.toLowerCase()}.${input.job.toLowerCase()}@email.com`;
  }
}

const person: Person = {
  firstName: "John",
  lasName: "Doe",
};

console.log(
  generateEmail(
    {
      firstName: "John",
      lasName: "Doe",
      // job: "Ewqdqdqwd",
      job: "Engineer",
      isVisitor: true,
    },
    true
  )
);
