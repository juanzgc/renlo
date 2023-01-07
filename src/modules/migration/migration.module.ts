import { Module } from 'medusa-extender'
import InitialMigration1670645201506 from '../migrations/1670645201506-InitialMigration'
@Module({
  imports: [InitialMigration1670645201506],
})
export class MigrationModule {}
