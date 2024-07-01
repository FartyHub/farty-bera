import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFartyClawUsersTable1719770363478
  implements MigrationInterface
{
  name = 'AddedFartyClawUsersTable1719770363478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "farty-claw-users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "username" text NOT NULL DEFAULT '',
                "first_name" text NOT NULL DEFAULT '',
                "last_name" text NOT NULL DEFAULT '',
                "address" text NOT NULL DEFAULT '',
                "telegram_id" text NOT NULL DEFAULT '',
                "language_code" text NOT NULL DEFAULT '',
                "chat_id" text NOT NULL DEFAULT '',
                CONSTRAINT "PK_4e0c21c2fb35120596d2f5e2498" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "farty-claw-users"
        `);
  }
}
