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
import { TaskListItemDTO, TaskRequestDTO } from './tasks.dto'
import { TasksService } from './tasks.service'

@Controller({
  path: 'projects/:projectId/tasks',
  version: '1',
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: [TaskListItemDTO] })
  findAllByProjectId(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.tasksService.findAllByProjectId(projectId)
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: TaskListItemDTO })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const foundTask = await this.tasksService.findById(id, projectId)
    if (!foundTask) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND)
    }
    return foundTask
  }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: TaskListItemDTO })
  async create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TaskRequestDTO) {
    return this.tasksService.create(projectId, data)
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK, type: TaskListItemDTO })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: TaskRequestDTO,
  ) {
    const foundTask = await this.tasksService.findById(id, projectId)
    if (!foundTask) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND)
    }
    return this.tasksService.update(id, projectId, data)
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const foundTask = await this.tasksService.findById(id, projectId)
    if (!foundTask) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND)
    }
    return this.tasksService.remove(id, projectId)
  }
}
