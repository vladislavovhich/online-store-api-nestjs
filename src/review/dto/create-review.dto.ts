import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"

export class CreateReviewDto {
    @ApiProperty({
        example: "review text",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    text: string

    @ApiProperty({
        example: "review text",
        required: true
    })
    @IsNumber()
    @Min(1)
    @Max(10)
    @IsNotEmpty()
    @Type(() => Number)
    rating: number
}
