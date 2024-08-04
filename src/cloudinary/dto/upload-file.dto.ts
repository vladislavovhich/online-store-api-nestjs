import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UploadFileDto {
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    file?: Express.Multer.File
}