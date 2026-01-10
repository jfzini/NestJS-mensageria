import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { ProjectRequestDto } from './projects.dto'

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany()
  }

  findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          omit: {
            projectId: true,
          },
        },
      },
    })
  }

  create(data: ProjectRequestDto) {
    // TODO: change this to the actual user id, moved logic from service
    return this.prisma.project.create({
      data: { ...data, createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580' },
    })
  }

  update(id: string, data: ProjectRequestDto) {
    return this.prisma.project.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } })
  }
}
