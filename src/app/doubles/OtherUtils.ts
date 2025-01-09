import { v4 } from "uuid";

export type stringInfo = {
  lowerCase: string;
  upperCase: string;
  characters: string[];
  length: number;
  extraInfo: Object | undefined;
};
type LoggerServiceCallBack = (arg: string) => void;

export function toUpperCase(arg: string): string {
  return arg.toUpperCase();
}

export function toLowerCaseWithId(arg: string): string {
  return arg.toLowerCase() + v4();
}

export function calculateComplexity(stringInfo: stringInfo) {
  return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

export function toUpperCaseWithCb(
  arg: string,
  callBack: LoggerServiceCallBack,
) {
  if (!arg) {
    callBack("No argument provided");

    return;
  }
  callBack(`called function with ${arg}`);
  return arg.toUpperCase();
}

export class OtherStringUtils {
  public toUpperCase(arg: string): string {
    return arg.toUpperCase();
  }
  public logString(arg: string): void {
    console.log(arg);
  }
  private callExternalService(): void {
    console.log("Calling external service!!!");
  }
}
