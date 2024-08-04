import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsString, IsAlphanumeric, MaxLength, IsEnum, IsISO8601, IsDate, IsOptional} from 'class-validator';
import { Type } from "class-transformer"
import { Roles } from 'src/common/enums';
import { UploadFileDto } from 'src/cloudinary/dto/upload-file.dto';

export class CreateUserDto {
    @ApiProperty({ type: 'string', format: 'binary', required: false, name: "file" })
    file: Express.Multer.File

    @ApiProperty({
        example: "example@gmail.com",
        required: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "password",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(5)
    @MaxLength(25)
    password: string;

    @ApiProperty({
        example: "John Smith",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    token?: string;

    @ApiProperty({description: "Birth Date", required: true, default: new Date()})
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    birthDate: Date

    @ApiProperty({
        example: Roles.CUSTOMER,
        required: false,
        default: Roles.CUSTOMER,
    })
    @IsEnum(Roles)
    role?: Roles = Roles.CUSTOMER
}
