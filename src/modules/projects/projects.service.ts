import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectRequestDto } from './projects.dto'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany()
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
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
    return project
  }

  create(data: ProjectRequestDto) {
    return this.prisma.project.create({
      data: { ...data, createdById: '12cdba13-c2c0-4349-9b90-afe7ddbce580' }, // TODO: change this to the actual user id
    })
  }

  update(id: string, data: ProjectRequestDto) {
    return this.prisma.project.update({ where: { id }, data })
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } })
  }
}
