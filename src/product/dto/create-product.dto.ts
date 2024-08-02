import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNotEmpty, IsString, isNumberString, IsNumber, Min, IsInt, IsArray, Validate, ValidateNested, IsPositive } from "class-validator";

export class ProductPropertyDto {
    @ApiProperty({description: "Property ID", required: true, default: 1})
    @IsInt()
    @Min(1)
    @Type(() => Number)
    propertyId: number

    @ApiProperty({description: "Property value", required: true, default: "Emile Zola"})
    @IsString()
    @IsNotEmpty()
    propertyValue: string
}

export class CreateProductDto {
    @ApiProperty({description: "Name", required: true, default: "Germinal"})
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({description: "Price", required: true, default: 1.5})
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price: number

    @ApiProperty({description: "Category ID", required: true, default: 1})
    @IsInt()
    @Min(1)
    @Type(() => Number)
    categoryId: number

    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => ProductPropertyDto)
    @ApiProperty({description: "Product properties", required: true, type: ProductPropertyDto, isArray: true})
    productProperties: ProductPropertyDto[] = []
}
