import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ omit: { password: true } })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, omit: { password: true } })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, omit: { password: true } })
  }
}
