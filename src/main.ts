import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { rabbitMQConfig } from './modules/queue/config/rabbitmq.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Connect the microservice to listen to RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    ...rabbitMQConfig,
    options: {
      ...rabbitMQConfig.options,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('💀 Unhandled error during bootstrap:', error);
  process.exit(1);
});
