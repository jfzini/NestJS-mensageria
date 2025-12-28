import { SetMetadata } from '@nestjs/common'
import { VALIDATE_EXISTING_USER_KEY } from 'src/consts'

export const ValidateExistingUser = (property: string) =>
  SetMetadata(VALIDATE_EXISTING_USER_KEY, property)
