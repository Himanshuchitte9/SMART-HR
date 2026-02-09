import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserPurpose } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        // Check if user already exists
        const existingUser = await this.usersRepository.findOne({
            where: [
                { email: registerDto.email },
                { mobile: registerDto.mobile },
            ],
        });

        if (existingUser) {
            throw new ConflictException('User with this email or mobile already exists');
        }

        // Hash password
        const password_hash = await bcrypt.hash(registerDto.password, 10);

        // Create user
        const user = this.usersRepository.create({
            ...registerDto,
            password_hash,
            purpose: registerDto.purpose as UserPurpose,
        });

        await this.usersRepository.save(user);

        // Remove password from response
        delete user.password_hash;

        return {
            message: 'Registration successful',
            user,
        };
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        delete user.password_hash;
        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        const payload = {
            sub: user.id,
            email: user.email,
            purpose: user.purpose,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async validateToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersRepository.findOne({
                where: { id: payload.sub },
            });

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            delete user.password_hash;
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
