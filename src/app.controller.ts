import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { AppService } from './app.service'

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Health check response',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string' },
      },
      example: {
        message: 'API is running!',
        timestamp: '20/12/2025, 11:14:14',
      },
    },
  })
  getHealthCheck(): { message: string; timestamp: string } {
    return this.appService.getHealthCheck()
  }
}
