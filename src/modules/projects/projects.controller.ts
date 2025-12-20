import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findById(id)
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: ProjectListItemDTO })
  create(@Body() data: ProjectRequestDto) {
    return this.projectsService.create(data)
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK, type: ProjectListItemDTO })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDto) {
    return this.projectsService.update(id, data)
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id)
  }
}
