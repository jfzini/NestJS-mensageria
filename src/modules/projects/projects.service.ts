import { Injectable } from '@nestjs/common'

@Injectable()
export class ProjectsService {
  findAll() {
    return 'This action returns all projects'
  }

  findById(id: string) {
    return `This action returns a #${id} project`
  }

  create(data: any) {
    return data
  }

  update(id: string, data: any) {
    return { id, ...data }
  }

  remove(id: string) {
    return `This action removes a #${id} project`
  }
}
