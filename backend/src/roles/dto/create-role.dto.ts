import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
    @ApiProperty({ example: 'abc-123-institute-id' })
    @IsUUID()
    institute_id: string;

    @ApiProperty({ example: 'Principal' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'parent-role-id', required: false })
    @IsOptional()
    @IsUUID()
    parent_role_id?: string;

    @ApiProperty({ example: 'Head of the institution', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    is_system_role?: boolean;
}
