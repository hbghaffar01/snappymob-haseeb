import {
  Controller,
  Post,
  Get,
  Query,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ProcessorService } from './processor.service';
import { existsSync } from 'fs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProcessFileDto } from './dto/process-file.dto';

@ApiTags('processor')
@Controller('processor')
export class ProcessorController {
  private readonly logger = new Logger(ProcessorController.name);

  constructor(private readonly processorService: ProcessorService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process a generated file' })
  @ApiResponse({
    status: 201,
    description: 'File processed successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        inputPath: { type: 'string', example: 'data/generated.txt' },
        outputPath: { type: 'string', example: 'data/processed.txt' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Input file not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async processFile(
    @Query() processFileDto: ProcessFileDto,
  ): Promise<{ status: string; inputPath: string; outputPath: string }> {
    try {
      const inputPath = processFileDto.inputPath || 'data/generated.txt';
      const outputPath = processFileDto.outputPath || 'data/processed.txt';

      if (!existsSync(inputPath)) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Input file not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log(
        `Starting file processing: ${inputPath} -> ${outputPath}`,
      );
      await this.processorService.processFile(inputPath, outputPath);

      return {
        status: 'success',
        inputPath,
        outputPath,
      };
    } catch (error) {
      this.logger.error(`Error processing file: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to process file',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Get processor service status' })
  @ApiResponse({
    status: 200,
    description: 'Service status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'Processor service is running' },
      },
    },
  })
  getStatus(): { status: string } {
    return { status: 'Processor service is running' };
  }
}
