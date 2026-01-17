import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../../prisma.service'
import { CreateUserRequestDto } from './users.dto'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    return this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      omit: { password: true },
      include: {
        assignedTasks: { omit: { assigneeId: true } },
        collaborations: { omit: { userId: true } },
        createdProjects: { omit: { createdById: true } },
      },
    })
  }

  async count() {
    return this.prisma.user.count()
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
    return this.prisma.user.create({ data, omit: { password: true } })
  }

  async findPasswordById(id: string): Promise<User | null> {
    return (await this.prisma.user.findUnique({
      where: { id },
      select: { password: true },
    })) as User
  }

  async updatePassword(id: string, passwordHash: string) {
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
