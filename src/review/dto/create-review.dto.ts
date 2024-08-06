import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class CreateReviewDto {
    @ApiProperty({
        example: "review text",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    text: string

    @ApiProperty({
        required: true
    })
    @IsNumber()
    @Min(1)
    @Max(10)
    @IsNotEmpty()
    @Type(() => Number)
    rating: number

    @ApiProperty({ type: 'string', format: 'binary', required: false, isArray: true })
    @IsOptional()
    files?: Express.Multer.File[]
}
