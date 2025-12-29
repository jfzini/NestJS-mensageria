import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ValidateExistingUser } from 'src/common/decorators/validate-existing-user.decorator'
import { ValidateExistingUserInterceptor } from 'src/common/interceptors/validate-existing-user/validate-existing-user.interceptor'
import { ChangePasswordRequestDto, CreateUserRequestDto, ListUserDto } from './users.dto'
import { UsersService } from './users.service'

@Controller({
  path: 'users',
  version: '1',
})
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
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id)
  }

  @ApiResponse({ status: 200, type: ListUserDto })
  @Get('email/:email')
  @ValidateExistingUser('email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email)
  }

  @Post()
  @ApiResponse({ status: 201, type: ListUserDto })
  async create(@Body() data: CreateUserRequestDto) {
    return this.usersService.create(data)
  }

  @ApiResponse({ status: 200, type: ListUserDto })
  @Patch('change-password/:id')
  @ValidateExistingUser('id')
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: ChangePasswordRequestDto,
  ) {
    return this.usersService.changePassword(id, data.oldPassword, data.newPassword)
  }
}
