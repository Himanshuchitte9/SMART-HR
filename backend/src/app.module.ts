import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InstitutesModule } from './institutes/institutes.module';
import { RolesModule } from './roles/roles.module';
import { EmploymentModule } from './employment/employment.module';
import { WorkflowModule } from './workflow/workflow.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Database
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || 'smarthr_user',
            password: process.env.DB_PASSWORD || 'smarthr_password',
            database: process.env.DB_DATABASE || 'smarthr_db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.NODE_ENV === 'development', // Only in dev
            logging: process.env.NODE_ENV === 'development',
        }),

        // Feature modules
        AuthModule,
        UsersModule,
        InstitutesModule,
        RolesModule,
        EmploymentModule,
        WorkflowModule,
        DashboardModule,
        DocumentsModule,
    ],
})
export class AppModule { }
