import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { TaskListItemDTO } from '../tasks/tasks.dto'

export class ProjectRequestDto {
  @ApiProperty({ description: 'Name of the project', example: 'Project 1' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Description of the project',
    example: 'This project is about...',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string
}

export class ProjectListItemDTO {
  @ApiProperty({
    description: 'ID of the project',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({ description: 'Name of the project', example: 'Project 1' })
  name: string

  @ApiProperty({ description: 'Description of the project', example: 'This project is about...' })
  description: string

  @ApiProperty({ description: 'Creation date of the project', example: '2025-12-20T16:27:09.000Z' })
  createdAt: Date

  @ApiProperty({ description: 'Update date of the project', example: '2025-12-20T16:27:09.000Z' })
  updatedAt: Date
}

export class ProjectWithTasksDTO extends ProjectListItemDTO {
  @ApiProperty({
    description: 'Tasks of the project',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Task 1',
        description: 'This task is about...',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '2025-12-20T16:27:09.000Z',
        createdAt: '2025-12-20T16:27:09.000Z',
        updatedAt: '2025-12-20T16:27:09.000Z',
      },
    ],
    type: [TaskListItemDTO],
  })
  tasks: TaskListItemDTO[]
}
