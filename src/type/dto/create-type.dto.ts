import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, Max, Min } from "class-validator"

export class CreateTypeDto {
    @ApiProperty({
        example: "string",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    name: string
}