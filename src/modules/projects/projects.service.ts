import { Injectable } from '@nestjs/common'
import { ProjectRequestDto } from './projects.dto'
import { ProjectsRepository } from './projects.repository'

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepository: ProjectsRepository) {}

  findAll() {
    return this.projectRepository.findAll()
  }

  async findById(id: string) {
    return this.projectRepository.findById(id)
  }

  create(data: ProjectRequestDto) {
    return this.projectRepository.create(data)
  }

  update(id: string, data: ProjectRequestDto) {
    return this.projectRepository.update(id, data)
  }

  remove(id: string) {
    return this.projectRepository.remove(id)
  }
}
