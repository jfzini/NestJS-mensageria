import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  password: string

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'avatar.jpg', required: false })
  avatar?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'USER', enum: UserRole, required: false, default: UserRole.USER })
  @IsEnum(UserRole)
  role?: UserRole
}

export class ListUserDto {
  @ApiProperty({ example: 'John Doe' })
  id: string

  @ApiProperty({ example: 'John Doe' })
  name: string

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string

  @ApiProperty({ example: 'avatar.jpg', required: false })
  avatar?: string

  @ApiProperty({ example: 'USER', enum: UserRole, default: UserRole.USER })
  role: UserRole

  @ApiProperty({ example: true })
  active: boolean

  @ApiProperty({ example: '2025-12-20T16:27:09.000Z' })
  createdAt: Date

  @ApiProperty({ example: '2025-12-20T16:27:09.000Z' })
  updatedAt: Date
}

export class ChangePasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  newPassword: string
}
