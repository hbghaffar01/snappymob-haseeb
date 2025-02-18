import { Injectable, Logger } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { RandomGenerator } from './random.generator';

@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);
  private readonly targetSizeBytes = 10 * 1024 * 1024;
  private readonly chunkSize = 5 * 1024 * 1024;

  constructor(private readonly randomGenerator: RandomGenerator) {}

  async generateFile(outputPath: string): Promise<void> {
    this.logger.log('Starting file generation...');
    let currentSize = 0;

    try {
      const stream = createWriteStream(outputPath);

      while (currentSize < this.targetSizeBytes) {
        const remainingBytes = this.targetSizeBytes - currentSize;
        const chunk = await this.generateChunk(
          Math.min(this.chunkSize, remainingBytes),
        );
        stream.write(chunk);
        currentSize += Buffer.byteLength(chunk);

        if (currentSize % (5 * 1024 * 1024) === 0) {
          this.logger.debug(
            `Generated ${(currentSize / 1024).toFixed(2)} KB of ${
              this.targetSizeBytes / 1024
            } KB`,
          );
        }
      }

      stream.end();
      this.logger.log('File generation completed successfully');
    } catch (error) {
      this.logger.error('Error generating file:', error);
      throw error;
    }
  }
  private async generateChunk(targetSize: number): Promise<string> {
    const objectTypes = ['string', 'real', 'integer', 'alphanumeric'];
    const chunkParts: string[] = [];
    let currentSize = 0;

    while (currentSize < targetSize) {
      const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
      let value: string;

      switch (type) {
        case 'string':
          value = this.randomGenerator.generateAlphabeticalString();
          break;
        case 'real':
          value = this.randomGenerator.generateRealNumber().toString();
          break;
        case 'integer':
          value = this.randomGenerator.generateInteger().toString();
          break;
        case 'alphanumeric':
          value = this.randomGenerator.generateAlphanumeric();

          const spacesBefore = ' '.repeat(Math.floor(Math.random() * 11));
          const spacesAfter = ' '.repeat(Math.floor(Math.random() * 11));
          value = `${spacesBefore}${value}${spacesAfter}`;
          break;
      }

      const newValueSize = Buffer.byteLength(value + ',');

      if (currentSize + newValueSize <= targetSize) {
        chunkParts.push(value);
        currentSize += newValueSize;
      } else {
        break;
      }
    }

    return chunkParts.join(',') + ',';
  }
}
