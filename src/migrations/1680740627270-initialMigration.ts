import { MigrationInterface, QueryRunner } from 'typeorm'

export class initialMigration1680740627270 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invite" ADD "store_id" character varying`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_invite_store_id" ON "invite" ("store_id")`
    )

    await queryRunner.query(
      `ALTER TABLE "invite" ADD CONSTRAINT "FK_invite_store_id" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    await queryRunner.query(
      `ALTER TABLE "order" ADD "store_id" character varying NOT NULL`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_order_store_id" ON "order" ("store_id")`
    )

    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_order_store_id" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    await queryRunner.query(
      `ALTER TABLE "product" ADD "store_id" character varying NOT NULL`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_product_store_id" ON "product" ("store_id")`
    )

    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_product_store_id" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    await queryRunner.query(
      `ALTER TABLE "sales_channel" ADD "store_id" character varying`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_sales_channel_store_id" ON "sales_channel" ("store_id")`
    )

    await queryRunner.query(
      `ALTER TABLE "sales_channel" ADD CONSTRAINT "FK_sales_channel_store_id" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )

    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "store_id" character varying`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_user_store_id" ON "user" ("store_id")`
    )

    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_user_store_id" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_user_store_id"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_user_store_id"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "store_id"`)
    await queryRunner.query(
      `ALTER TABLE "sales_channel" DROP CONSTRAINT "FK_sales_channel_store_id"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_sales_channel_store_id"`)
    await queryRunner.query(
      `ALTER TABLE "sales_channel" DROP COLUMN "store_id"`
    )

    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_product_store_id"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_product_store_id"`)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "store_id"`)
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_order_store_id"`
    )
    await queryRunner.query(`DROP INDEX "public"."IDX_order_store_id"`)
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "store_id"`)
  }
}
