import { Injectable, Logger } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { RandomGenerator } from './random.generator';

@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);
  private readonly targetSizeBytes = 10 * 1024 * 1024; // 10MB
  private readonly chunkSize = 5 * 1024 * 1024; // 5MB

  constructor(private readonly randomGenerator: RandomGenerator) {}

  /**
   * Generates a file containing random objects (alphabetical strings, real numbers,
   * integers, alphanumerics) separated by commas.
   * @param outputPath The path where the generated file will be saved.
   */
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

        // Log progress every 5MB
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

  /**
   * Generates a chunk of random objects up to the specified target size.
   * @param targetSize The maximum size of the chunk in bytes.
   * @returns A string containing random objects separated by commas.
   */
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

          // Add random spaces before and after alphanumeric values (up to 10 spaces)
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
