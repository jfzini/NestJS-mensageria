import { Controller, Get, Param } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ListUserDto } from './users.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, type: [ListUserDto] })
  async findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email)
  }
}
