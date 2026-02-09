import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '9876543210' })
    @IsString()
    mobile: string;

    @ApiProperty({ example: 'Password@123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 'MALE', required: false })
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiProperty({ example: '123 Main St, City', required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ example: 'MBA in HR Management', required: false })
    @IsOptional()
    @IsString()
    qualification?: string;

    @ApiProperty({ example: 5, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    experience_years?: number;

    @ApiProperty({ example: 'OWNER', enum: ['OWNER', 'EMPLOYEE'] })
    @IsEnum(['OWNER', 'EMPLOYEE'])
    purpose: string;
}
