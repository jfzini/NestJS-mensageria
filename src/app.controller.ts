import {
  Controller,
  Get,
  HttpStatus,
  Post,
  type RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { createHmac, timingSafeEqual } from 'crypto'
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

  @Post('linear-listener')
  getRawBody(@Req() request: RawBodyRequest<Request>) {
    const signature = request.headers['linear-signature'] as string

    if (!signature) {
      throw new UnauthorizedException('Linear signature is missing')
    }

    const secret =
      process.env.LINEAR_WEBHOOK_SECRET || 'lin_wh_s0qtt1i8YHL6IYfty4I1CTgl5kwVC5epeNCVD71ABN29'
    if (!secret) {
      throw new UnauthorizedException('Linear webhook secret is not configured')
    }

    const rawBody = request.rawBody
    if (!rawBody) {
      throw new UnauthorizedException('Request body is missing')
    }

    const headerSignature = Buffer.from(signature, 'hex')
    const computedSignature = createHmac('sha256', secret).update(rawBody).digest()

    // if (!timingSafeEqual(headerSignature, computedSignature)) {
    //   throw new UnauthorizedException('Invalid Linear signature')
    // }
    const result = timingSafeEqual(headerSignature, computedSignature)
    console.log({
      result,
      headerSignature,
      computedSignature,
      rawBody,
      signature,
      stringifiedRawBody: rawBody.toString(),
    })

    return {
      result,
      headerSignature,
      computedSignature,
      rawBody,
      signature,
      body: request.body,
    }
  }
}
