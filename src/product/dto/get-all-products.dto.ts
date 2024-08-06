import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"
import { SortValEnum } from "src/common/enums";

export class GetAllProductsDto extends PaginationDto {
    @ApiProperty({ required: false})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId: number

    @ApiProperty({description: "Price order [asc, desc]", required: false})
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(SortValEnum)
    priceOrder: string

    @ApiProperty({description: "Name order [asc, desc]", required: false})
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(SortValEnum)
    nameOrder: string
}