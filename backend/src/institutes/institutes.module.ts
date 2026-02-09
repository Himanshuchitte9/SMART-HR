import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutesController } from './institutes.controller';
import { InstitutesService } from './institutes.service';
import { Institute } from './entities/institute.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Institute, User])],
    controllers: [InstitutesController],
    providers: [InstitutesService],
    exports: [InstitutesService],
})
export class InstitutesModule { }
