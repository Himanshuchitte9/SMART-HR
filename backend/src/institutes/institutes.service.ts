import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institute, InstituteStatus } from './entities/institute.entity';
import { User, UserPurpose } from '../users/entities/user.entity';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { ApproveInstituteDto } from './dto/approve-institute.dto';

@Injectable()
export class InstitutesService {
    constructor(
        @InjectRepository(Institute)
        private institutesRepository: Repository<Institute>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createInstituteDto: CreateInstituteDto, userId: string) {
        // Verify user is an owner
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user || user.purpose !== UserPurpose.OWNER) {
            throw new ForbiddenException('Only users with OWNER purpose can create institutes');
        }

        const institute = this.institutesRepository.create({
            ...createInstituteDto,
            owner_id: userId,
            status: InstituteStatus.PENDING,
        });

        return this.institutesRepository.save(institute);
    }

    async findAll() {
        return this.institutesRepository.find({
            relations: ['owner'],
        });
    }

    async findPending() {
        return this.institutesRepository.find({
            where: { status: InstituteStatus.PENDING },
            relations: ['owner'],
        });
    }

    async findByOwner(ownerId: string) {
        return this.institutesRepository.find({
            where: { owner_id: ownerId },
        });
    }

    async findOne(id: string) {
        const institute = await this.institutesRepository.findOne({
            where: { id },
            relations: ['owner'],
        });

        if (!institute) {
            throw new NotFoundException('Institute not found');
        }

        return institute;
    }

    async approve(id: string, approveDto: ApproveInstituteDto, superAdminId: string) {
        const institute = await this.findOne(id);

        if (institute.status !== InstituteStatus.PENDING) {
            throw new ForbiddenException('Institute is not in pending status');
        }

        institute.status = approveDto.approved
            ? InstituteStatus.APPROVED
            : InstituteStatus.REJECTED;
        institute.approved_by = superAdminId;
        institute.approved_at = new Date();

        return this.institutesRepository.save(institute);
    }

    async update(id: string, updateData: Partial<Institute>) {
        const institute = await this.findOne(id);
        Object.assign(institute, updateData);
        return this.institutesRepository.save(institute);
    }

    async remove(id: string) {
        const institute = await this.findOne(id);
        await this.institutesRepository.softDelete(id);
        return { message: 'Institute deleted successfully' };
    }
}
