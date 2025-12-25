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
import { VALIDATE_RESOURCES_IDS_KEY } from 'src/consts'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class ValidateResourcesIdsInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Request>> {
    // Valida se o endpoint possui o decorator que indica a necessidade de validação
    const shouldValidate = this.reflector.get<boolean>(
      VALIDATE_RESOURCES_IDS_KEY,
      context.getHandler(),
    )

    if (!shouldValidate) {
      return next.handle()
    }

    // Valida o ProjectId
    const request = context.switchToHttp().getRequest()
    const { projectId } = request.params

    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND)
    }

    return next.handle()
  }
}
