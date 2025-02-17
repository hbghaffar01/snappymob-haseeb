import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ProcessFileDto {
  @ApiProperty({
    description: 'Input file path to process',
    default: 'data/generated.txt',
    required: false,
  })
  @IsString()
  @IsOptional()
  inputPath?: string;

  @ApiProperty({
    description: 'Output path for the processed file',
    default: 'data/processed.txt',
    required: false,
  })
  @IsString()
  @IsOptional()
  outputPath?: string;
}
