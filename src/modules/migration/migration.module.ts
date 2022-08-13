import { Module } from 'medusa-extender';
import { InitialMigration1659855426558 } from '../migrations/1659855426558-InitialMigration';

@Module({
  imports: [InitialMigration1659855426558]
})
export class MigrationModule {}
