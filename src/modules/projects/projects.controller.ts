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
  UseInterceptors,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids/validate-resources-ids.interceptor'
import { ProjectListItemDTO, ProjectRequestDto } from './projects.dto'
import { ProjectsService } from './projects.service'

@Controller({
  path: 'projects',
  version: '1',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [ProjectListItemDTO] })
  findAll() {
    return this.projectsService.findAll()
  }

  @Get(':projectId')
  @ValidateResourcesIds()
  @ApiResponse({ status: HttpStatus.OK, type: ProjectListItemDTO })
  async findById(@Param('projectId', ParseUUIDPipe) id: string) {
    return this.projectsService.findById(id)
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: ProjectListItemDTO })
  create(@Body() data: ProjectRequestDto) {
    return this.projectsService.create(data)
  }

  @Put(':projectId')
  @ApiResponse({ status: HttpStatus.OK, type: ProjectListItemDTO })
  @ValidateResourcesIds()
  async update(@Param('projectId', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDto) {
    return this.projectsService.update(id, data)
  }

  @Delete(':projectId')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  async remove(@Param('projectId', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id)
  }
}
