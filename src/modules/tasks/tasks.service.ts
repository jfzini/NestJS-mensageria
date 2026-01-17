import { Injectable } from '@nestjs/common'
import { TaskRequestDTO } from './tasks.dto'
import { TasksRepository } from './tasks.repository'

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  findAllByProjectId(projectId: string) {
    return this.tasksRepository.findAllByProjectId(projectId)
  }

  findById(id: string, projectId: string) {
    return this.tasksRepository.findById(id, projectId)
  }

  create(projectId: string, data: TaskRequestDTO) {
    return this.tasksRepository.create(projectId, data)
  }

  update(id: string, projectId: string, data: TaskRequestDTO) {
    return this.tasksRepository.update(id, projectId, data)
  }

  remove(id: string, projectId: string) {
    return this.tasksRepository.remove(id, projectId)
  }
}
