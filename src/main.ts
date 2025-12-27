import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { writeFileSync } from 'fs'
import { AppModule } from './app.module'

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule)

  // Enable URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
  })

  // Configure Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for NestJS - Mensageria application')
    .setVersion('1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  writeFileSync('swagger.json', JSON.stringify(document, null, 2))

  // Set up global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  // Start listening on the defined port
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
