import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { CreateUserRequestDto } from './users.dto'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const users = await this.usersRepository.findAll(skip, limit)
    const count = await this.usersRepository.count()
    const totalPages = Math.ceil(count / limit)
    return { users, count, totalPages }
  }

  async findById(id: string) {
    return this.usersRepository.findById(id)
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email)
  }

  async create(data: CreateUserRequestDto) {
    const userAlreadyExists = await this.usersRepository.findByEmail(data.email)
    if (userAlreadyExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT)
    }
    const passwordHash = await bcrypt.hash(data.password, 10)
    data.password = passwordHash
    return this.usersRepository.create(data)
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = await this.usersRepository.findPasswordById(id)

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordValid) {
      throw new HttpException('Current password is invalid', HttpStatus.BAD_REQUEST)
    }
    const passwordHash = await bcrypt.hash(newPassword, 10)
    return this.usersRepository.updatePassword(id, passwordHash)
  }

  async softDelete(id: string) {
    return this.usersRepository.softDelete(id)
  }
}
