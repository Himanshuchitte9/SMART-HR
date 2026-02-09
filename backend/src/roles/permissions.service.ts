import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private permissionsRepository: Repository<Permission>,
    ) { }

    async findAll() {
        return this.permissionsRepository.find({
            order: { category: 'ASC', name: 'ASC' },
        });
    }

    async findByCategory(category: string) {
        return this.permissionsRepository.find({
            where: { category },
            order: { name: 'ASC' },
        });
    }

    async getGroupedPermissions() {
        const permissions = await this.findAll();

        const grouped = permissions.reduce((acc, permission) => {
            const category = permission.category || 'OTHER';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
        }, {});

        return grouped;
    }
}
