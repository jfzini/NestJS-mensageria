import { Injectable } from '@nestjs/common'
import { ProjectRequestDto } from './projects.dto'

@Injectable()
export class ProjectsService {
  findAll() {
    return 'This action returns all projects'
  }

  findById(id: string) {
    return `This action returns a #${id} project`
  }

  create(data: ProjectRequestDto) {
    return data
  }

  update(id: string, data: ProjectRequestDto) {
    return { id, ...data }
  }

  remove(id: string) {
    return `This action removes a #${id} project`
  }
}
