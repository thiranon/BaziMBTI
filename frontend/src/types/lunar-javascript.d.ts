declare module "lunar-javascript" {
  export interface EightChar {
    setSect(sect: number): void;
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
  }

  export interface Lunar {
    getEightChar(): EightChar;
  }

  export class Solar {
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): Solar;
    getLunar(): Lunar;
  }
}
