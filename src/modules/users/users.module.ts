import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
  providers: [UsersService, UsersRepository, PrismaService],
  controllers: [UsersController],
})
export class UsersModule {}
