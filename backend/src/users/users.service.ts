import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll() {
        return this.usersRepository.find({
            select: ['id', 'name', 'email', 'mobile', 'purpose', 'status', 'created_at'],
        });
    }

    async findOne(id: string) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'mobile', 'gender', 'address', 'qualification', 'experience_years', 'purpose', 'status', 'created_at'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async update(id: string, updateData: Partial<User>) {
        const user = await this.findOne(id);
        Object.assign(user, updateData);
        return this.usersRepository.save(user);
    }

    async remove(id: string) {
        const user = await this.findOne(id);
        await this.usersRepository.softDelete(id);
        return { message: 'User deleted successfully' };
    }
}
