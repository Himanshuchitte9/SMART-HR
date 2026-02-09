import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionsRepository: Repository<Permission>,
        @InjectRepository(RolePermission)
        private rolePermissionsRepository: Repository<RolePermission>,
    ) { }

    async create(createRoleDto: CreateRoleDto) {
        // Calculate level based on parent
        let level = 1;
        if (createRoleDto.parent_role_id) {
            const parentRole = await this.rolesRepository.findOne({
                where: { id: createRoleDto.parent_role_id },
            });

            if (!parentRole) {
                throw new NotFoundException('Parent role not found');
            }

            // Verify parent belongs to same institute
            if (parentRole.institute_id !== createRoleDto.institute_id) {
                throw new BadRequestException('Parent role must belong to same institute');
            }

            level = parentRole.level + 1;
        }

        const role = this.rolesRepository.create({
            ...createRoleDto,
            level,
        });

        return this.rolesRepository.save(role);
    }

    async findByInstitute(instituteId: string) {
        return this.rolesRepository.find({
            where: { institute_id: instituteId },
            relations: ['parent_role'],
            order: { level: 'ASC', name: 'ASC' },
        });
    }

    async getOrgChart(instituteId: string) {
        const roles = await this.findByInstitute(instituteId);

        // Build hierarchical tree
        const roleMap = new Map();
        const tree = [];

        // First pass: create map
        roles.forEach(role => {
            roleMap.set(role.id, { ...role, children: [] });
        });

        // Second pass: build tree
        roles.forEach(role => {
            const node = roleMap.get(role.id);
            if (role.parent_role_id) {
                const parent = roleMap.get(role.parent_role_id);
                if (parent) {
                    parent.children.push(node);
                }
            } else {
                tree.push(node);
            }
        });

        return tree;
    }

    async findOne(id: string) {
        const role = await this.rolesRepository.findOne({
            where: { id },
            relations: ['parent_role', 'institute'],
        });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        return role;
    }

    async getRolePermissions(roleId: string) {
        const rolePermissions = await this.rolePermissionsRepository.find({
            where: { role_id: roleId },
            relations: ['permission'],
        });

        return rolePermissions.map(rp => rp.permission);
    }

    async getInheritedPermissions(roleId: string): Promise<Permission[]> {
        const role = await this.findOne(roleId);
        const permissions = new Map<string, Permission>();

        // Get direct permissions
        const directPermissions = await this.getRolePermissions(roleId);
        directPermissions.forEach(p => permissions.set(p.id, p));

        // Get parent permissions recursively
        if (role.parent_role_id) {
            const parentPermissions = await this.getInheritedPermissions(role.parent_role_id);
            parentPermissions.forEach(p => permissions.set(p.id, p));
        }

        return Array.from(permissions.values());
    }

    async assignPermissions(roleId: string, assignPermissionsDto: AssignPermissionsDto) {
        const role = await this.findOne(roleId);

        // Remove existing permissions
        await this.rolePermissionsRepository.delete({ role_id: roleId });

        // Add new permissions
        const rolePermissions = assignPermissionsDto.permission_ids.map(permissionId => {
            return this.rolePermissionsRepository.create({
                role_id: roleId,
                permission_id: permissionId,
            });
        });

        await this.rolePermissionsRepository.save(rolePermissions);

        return { message: 'Permissions assigned successfully' };
    }

    async canPerformAction(
        userRoleId: string,
        targetRoleId: string,
        permissionKey: string,
    ): Promise<boolean> {
        const userRole = await this.findOne(userRoleId);
        const targetRole = await this.findOne(targetRoleId);

        // Check level hierarchy (child cannot modify parent)
        if (userRole.level >= targetRole.level) {
            return false;
        }

        // Check if user has the required permission (including inherited)
        const permissions = await this.getInheritedPermissions(userRoleId);
        return permissions.some(p => p.key === permissionKey);
    }

    async update(id: string, updateData: Partial<Role>) {
        const role = await this.findOne(id);
        Object.assign(role, updateData);
        return this.rolesRepository.save(role);
    }

    async remove(id: string) {
        const role = await this.findOne(id);

        // Check if role has children
        const children = await this.rolesRepository.find({
            where: { parent_role_id: id },
        });

        if (children.length > 0) {
            throw new BadRequestException('Cannot delete role with child roles');
        }

        await this.rolesRepository.softDelete(id);
        return { message: 'Role deleted successfully' };
    }
}
