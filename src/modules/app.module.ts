import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from 'src/controllers/app.controller';
import { EventHandlersModule } from 'src/modules/event.module';
import { EventPublisherService } from 'src/services/eventPublisher.service';
import { NotificationService } from 'src/services/notification.service';
import { ExampleModule } from './example.module';

const appRoot = join(__dirname, "..", "..","..", "..", "..", "..")

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(appRoot, "frontend", "dist") }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION, {
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
      dbName: process.env.MONGO_INITDB_DATABASE,
    }),
    EventEmitterModule.forRoot(),
    ExampleModule,
    EventHandlersModule
  ],
  controllers: [AppController],
  providers: [
    NotificationService, 
    EventPublisherService
  ],
})
export class AppModule { }

