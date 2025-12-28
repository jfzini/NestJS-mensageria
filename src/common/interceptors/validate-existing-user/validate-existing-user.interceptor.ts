import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { VALIDATE_EXISTING_USER_KEY } from 'src/consts'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class ValidateExistingUserInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Request>> {
    const request = context.switchToHttp().getRequest()
    const { id, email } = request.params

    const shouldValidate = this.reflector.get<string>(
      VALIDATE_EXISTING_USER_KEY,
      context.getHandler(),
    )

    if (!shouldValidate) {
      return next.handle()
    }

    switch (shouldValidate) {
      case 'id': {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        break
      }

      case 'email': {
        const user = await this.prisma.user.findUnique({ where: { email } })
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        break
      }

      default:
        break
    }

    return next.handle()
  }
}
