import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TaskRequestDTO } from './tasks.dto'

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByProjectId(projectId: string) {
    return this.prisma.task.findMany({ where: { projectId } })
  }

  findById(id: string, projectId: string) {
    return this.prisma.task.findUnique({ where: { id, projectId } })
  }

  create(projectId: string, data: TaskRequestDTO) {
    return this.prisma.task.create({ data: { ...data, projectId } })
  }

  update(id: string, projectId: string, data: TaskRequestDTO) {
    const dataWithoutProjectId = { ...data, projectId }
    return this.prisma.task.update({ where: { id, projectId }, data: dataWithoutProjectId })
  }

  remove(id: string, projectId: string) {
    return this.prisma.task.delete({ where: { id, projectId } })
  }
}
