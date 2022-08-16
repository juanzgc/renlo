import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class InitialMigration1659855426558 implements MigrationInterface {
  name = 'InitialMigration1659855426558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "store_id" text;`;
    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE public."user" DROP COLUMN "store_id";`;
    await queryRunner.query(query);
  }
  // public async up(queryRunner: QueryRunner): Promise<void> {
  //   await queryRunner.query(`ALTER TABLE "user" ADD "store_id" character varying`);
  //   await queryRunner.query(`CREATE INDEX "IDX_0b7eefd81e97f9a779785f6608" ON "user" ("store_id") `);
  //   await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_0b7eefd81e97f9a779785f66080" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  // }

  // public async down(queryRunner: QueryRunner): Promise<void> {
  //   await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_0b7eefd81e97f9a779785f66080"`);
  //   await queryRunner.query(`DROP INDEX "public"."IDX_0b7eefd81e97f9a779785f6608"`);
  //   await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "store_id"`);
  // }
}
