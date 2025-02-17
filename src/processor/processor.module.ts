import { Module } from '@nestjs/common';
import { ProcessorService } from './processor.service';
import { ProcessorController } from './processor.controller';

@Module({
  providers: [ProcessorService],
  controllers: [ProcessorController],
  exports: [ProcessorService],
})
export class ProcessorModule {}
