import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiQuery, ApiResponse } from '@nestjs/swagger'
import { ValidateExistingUser } from 'src/common/decorators/validate-existing-user.decorator'
import { ValidateExistingUserInterceptor } from 'src/common/interceptors/validate-existing-user/validate-existing-user.interceptor'
import {
  ChangePasswordRequestDto,
  CreateUserRequestDto,
  ListAllUsersDto,
  ListUserDto,
} from './users.dto'
import { UsersService } from './users.service'

@Controller({
  path: 'users',
  version: '1',
})
@UseInterceptors(ValidateExistingUserInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: ListAllUsersDto })
  @ApiQuery({ name: 'page', required: false, default: 1, minimum: 1 })
  @ApiQuery({ name: 'limit', required: false, default: 10, minimum: 1, maximum: 100 })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ) {
    if (page < 1) page = 1
    if (limit < 1) limit = 10
    if (limit > 100) limit = 100
    return this.usersService.findAll(page, limit)
  }

  @ApiResponse({ status: HttpStatus.OK, type: ListUserDto })
  @Get(':id')
  @ValidateExistingUser('id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id)
  }

  @ApiResponse({ status: HttpStatus.OK, type: ListUserDto })
  @Get('email/:email')
  @ValidateExistingUser('email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email)
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: ListUserDto })
  async create(@Body() data: CreateUserRequestDto) {
    return this.usersService.create(data)
  }

  @ApiResponse({ status: HttpStatus.OK, type: ListUserDto })
  @Patch('change-password/:id')
  @ValidateExistingUser('id')
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: ChangePasswordRequestDto,
  ) {
    return this.usersService.changePassword(id, data.oldPassword, data.newPassword)
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete('deactivate/:id')
  @ValidateExistingUser('id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.softDelete(id)
    return
  }
}
