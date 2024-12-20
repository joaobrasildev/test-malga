import { Module } from '@nestjs/common';
import { ConfigModule } from './shared/config/config.module';
import { PersistenceModule } from './module/persistence/persistence.module';

@Module({
  imports: [ConfigModule.forRoot(), PersistenceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
