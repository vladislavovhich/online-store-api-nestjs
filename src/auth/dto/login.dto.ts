import { PartialType, OmitType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class LoginDto extends PickType(CreateUserDto, ['email', 'password', 'role']) {}