import { ApiProperty } from '@nestjs/swagger'
import { TaskPriority, TaskStatus } from '@prisma/client'
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class TaskRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Title of the task', example: 'Task 1' })
  title: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the task',
    example: 'This task is about...',
    required: false,
  })
  description?: string

  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiProperty({
    description: 'Status of the task',
    example: 'TODO',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    required: false,
  })
  status?: TaskStatus = TaskStatus.TODO

  @IsEnum(TaskPriority)
  @IsOptional()
  @ApiProperty({
    description: 'Priority of the task',
    example: 'MEDIUM',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    required: false,
  })
  priority?: TaskPriority = TaskPriority.MEDIUM

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Due date of the task',
    example: '2025-12-20T16:27:09.000Z',
    required: false,
  })
  dueDate?: string
}

export class TaskListItemDTO {
  @ApiProperty({ description: 'ID of the task', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string

  @ApiProperty({ description: 'Title of the task', example: 'Task 1' })
  title: string

  @ApiProperty({ description: 'Description of the task', example: 'This task is about...' })
  description: string

  @ApiProperty({ description: 'Status of the task', example: 'TODO', enum: TaskStatus })
  status: TaskStatus

  @ApiProperty({ description: 'Priority of the task', example: 'MEDIUM', enum: TaskPriority })
  priority: TaskPriority

  @ApiProperty({ description: 'Due date of the task', example: '2025-12-20T16:27:09.000Z' })
  dueDate: string

  @ApiProperty({ description: 'Creation date of the task', example: '2025-12-20T16:27:09.000Z' })
  createdAt: Date

  @ApiProperty({ description: 'Update date of the task', example: '2025-12-20T16:27:09.000Z' })
  updatedAt: Date
}
