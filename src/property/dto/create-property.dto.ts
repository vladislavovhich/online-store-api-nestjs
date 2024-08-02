import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator"

export class CreatePropertyDto {
    @ApiProperty({
        example: "author",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        example: 1,
        required: true
    })
    @IsInt()
    @Min(1)
    typeId: number
}
