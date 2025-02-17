import { Injectable, Logger } from '@nestjs/common';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { writeFile } from 'fs/promises';

@Injectable()
export class ProcessorService {
  private readonly logger = new Logger(ProcessorService.name);

  async processFile(inputPath: string, outputPath: string): Promise<void> {
    this.logger.log('Starting file processing...');
    const fileStream = createReadStream(inputPath);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let output = '';
    let count = 0;

    for await (const line of rl) {
      const objects = line.split(',');

      for (const obj of objects) {
        if (!obj.trim()) continue;

        const type = this.determineType(obj);
        const formattedObj = type === 'alphanumeric' ? obj.trim() : obj;
        output += `Object: ${formattedObj}, Type: ${type}\n`;
        count++;
      }
    }

    await writeFile(outputPath, output);
    this.logger.log(`Processed ${count} objects successfully`);
  }

  private determineType(value: string): string {
    const trimmedValue = value.trim();

    if (/^\d+$/.test(trimmedValue)) {
      return 'integer';
    }

    if (/^\d*\.\d+$/.test(trimmedValue)) {
      return 'real';
    }

    if (/^[a-zA-Z]+$/.test(trimmedValue)) {
      return 'string';
    }

    if (/^[\s]*[a-zA-Z0-9]+[\s]*$/.test(value)) {
      return 'alphanumeric';
    }

    return 'unknown';
  }
}
