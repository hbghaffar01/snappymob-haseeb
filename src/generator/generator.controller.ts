import {
  Controller,
  Post,
  Get,
  Query,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerateFileDto } from './dto/generate-file.dto';

@ApiTags('generator')
@Controller('generator')
export class GeneratorController {
  private readonly logger = new Logger(GeneratorController.name);

  constructor(private readonly generatorService: GeneratorService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a file with random objects' })
  @ApiResponse({
    status: 201,
    description: 'File generated successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        path: { type: 'string', example: 'data/generated.txt' },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async generateFile(
    @Query() generateFileDto: GenerateFileDto,
  ): Promise<{ status: string; path: string }> {
    try {
      const outputPath = generateFileDto.outputPath || 'data/generated.txt';
      this.logger.log(`Starting file generation at path: ${outputPath}`);
      await this.generatorService.generateFile(outputPath);

      return {
        status: 'success',
        path: outputPath,
      };
    } catch (error) {
      this.logger.error(`Error generating file: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to generate file',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Get generator service status' })
  @ApiResponse({
    status: 200,
    description: 'Service status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'Generator service is running' },
      },
    },
  })
  getStatus(): { status: string } {
    return { status: 'Generator service is running' };
  }
}
