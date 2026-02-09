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
import { Institute } from '../../institutes/entities/institute.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    institute_id: string;

    @ManyToOne(() => Institute)
    @JoinColumn({ name: 'institute_id' })
    institute: Institute;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'uuid', nullable: true })
    parent_role_id: string;

    @ManyToOne(() => Role, { nullable: true })
    @JoinColumn({ name: 'parent_role_id' })
    parent_role: Role;

    @Column({ type: 'int', default: 1 })
    level: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'boolean', default: false })
    is_system_role: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
