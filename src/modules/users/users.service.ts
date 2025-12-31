import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma.service'
import { CreateUserRequestDto } from './users.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const users = await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      omit: { password: true },
      include: {
        assignedTasks: { omit: { assigneeId: true } },
        collaborations: { omit: { userId: true } },
        createdProjects: { omit: { createdById: true } },
      },
    })
    const count = await this.prisma.user.count()
    const totalPages = Math.ceil(count / limit)
    return { users, count, totalPages }
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
      include: {
        assignedTasks: { omit: { assigneeId: true } },
        collaborations: { omit: { userId: true } },
        createdProjects: { omit: { createdById: true } },
      },
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      omit: { password: true },
      include: {
        assignedTasks: { omit: { assigneeId: true } },
        collaborations: { omit: { userId: true } },
        createdProjects: { omit: { createdById: true } },
      },
    })
  }

  async create(data: CreateUserRequestDto) {
    const userAlreadyExists = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (userAlreadyExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT)
    }
    const passwordHash = await bcrypt.hash(data.password, 10)
    data.password = passwordHash
    return this.prisma.user.create({ data, omit: { password: true } })
  }

  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const user = (await this.prisma.user.findUnique({
      where: { id },
      select: { password: true },
    })) as User

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordValid) {
      throw new HttpException('Current password is invalid', HttpStatus.BAD_REQUEST)
    }
    const passwordHash = await bcrypt.hash(newPassword, 10)
    return this.prisma.user.update({
      where: { id },
      data: { password: passwordHash },
      omit: { password: true },
    })
  }

  async softDelete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { active: false },
    })
  }
}
