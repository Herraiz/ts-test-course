export class StringUtils {
  public toUpperCase(arg: string): string {
    if (!arg) {
      throw new Error("Invalid argument!");
    }
    return arg.toUpperCase();
  }
}

export function toUpperCase(arg: string): string {
  return arg.toUpperCase();
}

export type stringInfo = {
  lowerCase: string;
  upperCase: string;
  characters: string[];
  lengh: number;
  extraInfo: Object | undefined;
};

export function getStringInfo(arg: string): stringInfo {
  return {
    lowerCase: arg.toLowerCase(),
    upperCase: arg.toUpperCase(),
    characters: Array.from(arg),
    lengh: arg.length,
    extraInfo: {},
  };
}
