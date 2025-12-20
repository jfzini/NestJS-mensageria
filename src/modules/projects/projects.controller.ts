import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ProjectListItemDTO, ProjectRequestDto } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [ProjectListItemDTO] })
  findAll() {
    return this.projectsService.findAll()
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: ProjectListItemDTO })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const foundProject = await this.projectsService.findById(id)
    if (!foundProject) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }
    return foundProject
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: ProjectListItemDTO })
  create(@Body() data: ProjectRequestDto) {
    return this.projectsService.create(data)
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK, type: ProjectListItemDTO })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDto) {
    const foundProject = await this.projectsService.findById(id)
    if (!foundProject) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }
    return this.projectsService.update(id, data)
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const foundProject = await this.projectsService.findById(id)
    if (!foundProject) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }
    return this.projectsService.remove(id)
  }
}
