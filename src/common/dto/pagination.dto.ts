import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class PaginationDto {
    @ApiProperty({
        required: false,
        default: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1

    @ApiProperty({
        required: false,
        default: 6
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number = 6
}