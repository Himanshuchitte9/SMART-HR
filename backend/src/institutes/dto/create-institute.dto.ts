import { IsString, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InstituteType } from '../entities/institute.entity';

export class CreateInstituteDto {
    @ApiProperty({ example: 'ABC International School' })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'SCHOOL',
        enum: InstituteType
    })
    @IsEnum(InstituteType)
    type: InstituteType;

    @ApiProperty({ example: '123 Education Lane, City', required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ example: 'contact@abcschool.com', required: false })
    @IsOptional()
    @IsEmail()
    contact_email?: string;

    @ApiProperty({ example: '9876543210', required: false })
    @IsOptional()
    @IsString()
    contact_phone?: string;
}
