import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeneratorModule } from './generator/generator.module';
import { ProcessorModule } from './processor/processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GeneratorModule,
    ProcessorModule,
  ],
})
export class AppModule {}
