function generateEmail(input) {
    return "".concat(input.firstName.toLowerCase(), ".").concat(input.lasName.toLowerCase(), ".+ ").concat(input.job.toLowerCase(), "@email.com");
}
var person = {
    firstName: "John",
    lasName: "Doe"
};
console.log(generateEmail({
    firstName: "John",
    lasName: "Doe",
    // job: "Ewqdqdqwd",
    job: "Engineer"
}));
