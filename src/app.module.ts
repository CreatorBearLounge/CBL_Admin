import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtManagementModule } from './admin/artManagement.module';
import { DistributionModule } from './admin/distribution/distribution.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfoModule } from './Client/info/info.module';
import { ShopModule } from './Client/shop/shop.module';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ArtManagementModule,
    ShopModule,
    InfoModule,
    DistributionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
