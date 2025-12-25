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
import { TaskListItemDTO, TaskRequestDTO } from './tasks.dto'
import { TasksService } from './tasks.service'

@Controller({
  path: 'projects/:projectId/tasks',
  version: '1',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [TaskListItemDTO] })
  @ValidateResourcesIds()
  findAllByProjectId(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.tasksService.findAllByProjectId(projectId)
  }

  @Get(':taskId')
  @ApiResponse({ status: HttpStatus.OK, type: TaskListItemDTO })
  @ValidateResourcesIds()
  async findById(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.tasksService.findById(taskId, projectId)
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: TaskListItemDTO })
  @ValidateResourcesIds()
  async create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TaskRequestDTO) {
    return this.tasksService.create(projectId, data)
  }

  @Put(':taskId')
  @ApiResponse({ status: HttpStatus.OK, type: TaskListItemDTO })
  @ValidateResourcesIds()
  async update(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: TaskRequestDTO,
  ) {
    return this.tasksService.update(taskId, projectId, data)
  }

  @Delete(':taskId')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  async delete(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    return this.tasksService.remove(taskId, projectId)
  }
}
