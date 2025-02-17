import { Module } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GeneratorController } from './generator.controller';
import { RandomGenerator } from './random.generator';

@Module({
  providers: [GeneratorService, RandomGenerator],
  controllers: [GeneratorController],
  exports: [GeneratorService],
})
export class GeneratorModule {}
