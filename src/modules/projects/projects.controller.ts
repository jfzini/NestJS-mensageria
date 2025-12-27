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
import { ProjectListItemDTO, ProjectRequestDto, ProjectWithTasksDTO } from './projects.dto'
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
  @ApiResponse({ status: HttpStatus.OK, type: ProjectWithTasksDTO })
  async findById(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.projectsService.findById(projectId)
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: ProjectListItemDTO })
  create(@Body() data: ProjectRequestDto) {
    return this.projectsService.create(data)
  }

  @Put(':projectId')
  @ApiResponse({ status: HttpStatus.OK, type: ProjectListItemDTO })
  @ValidateResourcesIds()
  async update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: ProjectRequestDto,
  ) {
    return this.projectsService.update(projectId, data)
  }

  @Delete(':projectId')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  async remove(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.projectsService.remove(projectId)
  }
}
