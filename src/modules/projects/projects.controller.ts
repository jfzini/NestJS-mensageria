import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ProjectsService } from './projects.service'

@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.projectsService.findById(id)
  }

  @Post()
  create(@Body() data: any) {
    return this.projectsService.create(data)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.projectsService.update(id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id)
  }
}
