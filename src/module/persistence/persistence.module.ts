import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@src/shared/config/config.module';
import { TypeOrmPersistenceModule } from '@src/shared/persistence/typeorm/typeorm-persistence.module';

@Module({})
export class PersistenceModule {
  static forRoot(opts?: { migrations?: string[] }): DynamicModule {
    const { migrations } = opts || {};
    return {
      module: PersistenceModule,
      imports: [
        TypeOrmPersistenceModule.forRoot({
          migrations,
          entities: [],
        }),
        ConfigModule.forRoot(),
      ],
      providers: [],
      exports: [],
    };
  }
}
