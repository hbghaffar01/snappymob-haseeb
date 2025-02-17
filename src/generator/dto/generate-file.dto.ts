import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GenerateFileDto {
  @ApiProperty({
    description: 'Output path for the generated file',
    default: 'data/generated.txt',
    required: false,
  })
  @IsString()
  @IsOptional()
  outputPath?: string;
}
