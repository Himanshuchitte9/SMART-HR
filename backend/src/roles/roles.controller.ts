import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { PermissionsService } from './permissions.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
        private readonly permissionsService: PermissionsService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new role' })
    async create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get('institute/:instituteId')
    @ApiOperation({ summary: 'Get all roles for an institute' })
    async findByInstitute(@Param('instituteId') instituteId: string) {
        return this.rolesService.findByInstitute(instituteId);
    }

    @Get('institute/:instituteId/org-chart')
    @ApiOperation({ summary: 'Get organization chart for an institute' })
    async getOrgChart(@Param('instituteId') instituteId: string) {
        return this.rolesService.getOrgChart(instituteId);
    }

    @Get('permissions')
    @ApiOperation({ summary: 'Get all available permissions' })
    async getAllPermissions() {
        return this.permissionsService.findAll();
    }

    @Get('permissions/grouped')
    @ApiOperation({ summary: 'Get permissions grouped by category' })
    async getGroupedPermissions() {
        return this.permissionsService.getGroupedPermissions();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get role by ID' })
    async findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @Get(':id/permissions')
    @ApiOperation({ summary: 'Get direct permissions for a role' })
    async getRolePermissions(@Param('id') id: string) {
        return this.rolesService.getRolePermissions(id);
    }

    @Get(':id/permissions/inherited')
    @ApiOperation({ summary: 'Get all inherited permissions for a role' })
    async getInheritedPermissions(@Param('id') id: string) {
        return this.rolesService.getInheritedPermissions(id);
    }

    @Put(':id/permissions')
    @ApiOperation({ summary: 'Assign permissions to a role' })
    async assignPermissions(
        @Param('id') id: string,
        @Body() assignPermissionsDto: AssignPermissionsDto,
    ) {
        return this.rolesService.assignPermissions(id, assignPermissionsDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a role' })
    async remove(@Param('id') id: string) {
        return this.rolesService.remove(id);
    }
}
