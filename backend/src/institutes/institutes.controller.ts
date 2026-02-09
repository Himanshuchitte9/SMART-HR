import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { InstitutesService } from './institutes.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { ApproveInstituteDto } from './dto/approve-institute.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('institutes')
@Controller('institutes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InstitutesController {
    constructor(private readonly institutesService: InstitutesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new institute (Owner only)' })
    @ApiResponse({ status: 201, description: 'Institute created and pending approval' })
    async create(@Body() createInstituteDto: CreateInstituteDto, @Request() req) {
        return this.institutesService.create(createInstituteDto, req.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all institutes' })
    async findAll() {
        return this.institutesService.findAll();
    }

    @Get('pending')
    @ApiOperation({ summary: 'Get pending institutes (Super Admin only)' })
    async findPending() {
        return this.institutesService.findPending();
    }

    @Get('my-institutes')
    @ApiOperation({ summary: 'Get institutes owned by current user' })
    async getMyInstitutes(@Request() req) {
        return this.institutesService.findByOwner(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get institute by ID' })
    async findOne(@Param('id') id: string) {
        return this.institutesService.findOne(id);
    }

    @Put(':id/approve')
    @ApiOperation({ summary: 'Approve or reject institute (Super Admin only)' })
    async approve(
        @Param('id') id: string,
        @Body() approveDto: ApproveInstituteDto,
        @Request() req,
    ) {
        return this.institutesService.approve(id, approveDto, req.user.id);
    }
}
