import { Migration } from 'medusa-extender'
import { MigrationInterface, QueryRunner } from 'typeorm'

@Migration()
export default class InitialMigration1670645201506
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "store_id" character varying`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0b7eefd81e97f9a779785f6608" ON "user" ("store_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_0b7eefd81e97f9a779785f66080" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    // await queryRunner.query(
    //   `ALTER TABLE "order" ADD "store_id" character varying`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "order" ADD "order_parent_id" character varying NOT NULL`
    // )
    // await queryRunner.query(
    //   `CREATE INDEX "IDX_order_store_id" ON "order" ("store_id")`
    // )
    // await queryRunner.query(
    //   `CREATE INDEX "IDX_order_order_parent_id" ON "order" ("order_parent_id")`
    // )
    // await queryRunner.query(
    //   `ALTER TABLE "order" ADD CONSTRAINT "FK_order_store_id" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    // )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_0b7eefd81e97f9a779785f66080"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b7eefd81e97f9a779785f6608"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "store_id"`)
  }
}
