import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
    @ApiProperty({
        example: ['perm-id-1', 'perm-id-2'],
        description: 'Array of permission IDs to assign to the role'
    })
    @IsArray()
    @IsUUID('4', { each: true })
    permission_ids: string[];
}
