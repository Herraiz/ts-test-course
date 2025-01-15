var a: string = "!";
var b: number = 5;
var c: boolean = false;

var someArray: string[] = ["Hello", "World"];
someArray.push(a);
someArray.push(b as any); // very bad practice

console.log(someArray);
