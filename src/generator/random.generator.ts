import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomGenerator {
  private readonly charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly numeric_set = '0123456789';

  generateAlphabeticalString(length = 10): string {
    return Array.from(
      { length },
      () => this.charset[Math.floor(Math.random() * this.charset.length)],
    ).join('');
  }

  generateRealNumber(): number {
    return parseFloat((Math.random() * 1000).toFixed(2));
  }

  generateInteger(): number {
    return Math.floor(Math.random() * 1000);
  }

  generateAlphanumeric(): string {
    const spaces = {
      before: Math.floor(Math.random() * 11),
      after: Math.floor(Math.random() * 11),
    };

    const value = Array.from(
      { length: Math.floor(Math.random() * 10) + 5 },
      () => {
        const set = Math.random() > 0.5 ? this.charset : this.numeric_set;
        return set[Math.floor(Math.random() * set.length)];
      },
    ).join('');

    return ' '.repeat(spaces.before) + value + ' '.repeat(spaces.after);
  }
}
