import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum InstituteType {
    SCHOOL = 'SCHOOL',
    COLLEGE = 'COLLEGE',
    CORPORATE = 'CORPORATE',
    OFFICE = 'OFFICE',
    FACTORY = 'FACTORY',
    NGO = 'NGO',
    CUSTOM = 'CUSTOM',
}

export enum InstituteStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    SUSPENDED = 'SUSPENDED',
}

@Entity('institutes')
export class Institute {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150 })
    name: string;

    @Column({
        type: 'enum',
        enum: InstituteType,
    })
    type: InstituteType;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ length: 100, nullable: true })
    contact_email: string;

    @Column({ length: 15, nullable: true })
    contact_phone: string;

    @Column({ type: 'uuid', nullable: true })
    owner_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @Column({
        type: 'enum',
        enum: InstituteStatus,
        default: InstituteStatus.PENDING,
    })
    status: InstituteStatus;

    @Column({ type: 'uuid', nullable: true })
    approved_by: string;

    @Column({ type: 'timestamp', nullable: true })
    approved_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
