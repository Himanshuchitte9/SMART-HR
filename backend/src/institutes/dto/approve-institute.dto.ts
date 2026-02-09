import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveInstituteDto {
    @ApiProperty({ example: true })
    @IsBoolean()
    approved: boolean;

    @ApiProperty({ example: 'Meets all requirements', required: false })
    @IsOptional()
    @IsString()
    notes?: string;
}
