import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ValidateExistingUser } from 'src/common/decorators/validate-existing-user.decorator'
import { ValidateExistingUserInterceptor } from 'src/common/interceptors/validate-existing-user/validate-existing-user.interceptor'
import { ListUserDto } from './users.dto'
import { UsersService } from './users.service'

@Controller('users')
@UseInterceptors(ValidateExistingUserInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: 200, type: [ListUserDto] })
  async findAll() {
    return this.usersService.findAll()
  }

  @ApiResponse({ status: 200, type: ListUserDto })
  @Get(':id')
  @ValidateExistingUser('id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @ApiResponse({ status: 200, type: ListUserDto })
  @Get('email/:email')
  @ValidateExistingUser('email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email)
  }
}
