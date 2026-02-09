import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserPurpose {
    OWNER = 'OWNER',
    EMPLOYEE = 'EMPLOYEE',
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 15, unique: true })
    mobile: string;

    @Column({ length: 255 })
    @Exclude()
    password_hash: string;

    @Column({ length: 10, nullable: true })
    gender: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'text', nullable: true })
    qualification: string;

    @Column({ type: 'int', default: 0 })
    experience_years: number;

    @Column({
        type: 'enum',
        enum: UserPurpose,
    })
    purpose: UserPurpose;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    status: UserStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
