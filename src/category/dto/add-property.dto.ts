import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNotEmpty, IsString, isNumberString, IsNumber, Min, IsInt } from "class-validator";

export class AddPropertyDto {
    @ApiProperty({description: "Property ID", required: true})
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    propertyId: number

    @ApiProperty({description: "Category ID", required: true})
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    categoryId: number
}