import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedInvoiceTable1718297997112 implements MigrationInterface {
  name = 'AddedInvoiceTable1718297997112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "invoices" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "pre_checkout_query_id" text NOT NULL DEFAULT '',
                "first_name" text NOT NULL DEFAULT '',
                "last_name" text NOT NULL DEFAULT '',
                "currency" text NOT NULL DEFAULT '',
                "total_amount" integer NOT NULL DEFAULT '0',
                "telegram_payment_charge_id" text NOT NULL DEFAULT '',
                "provider_payment_charge_id" text NOT NULL DEFAULT '',
                CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "invoices"
        `);
  }
}
