import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1714039209772 implements MigrationInterface {
  name = 'InitialMigration1714039209772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "address" text NOT NULL,
                "invite_code" text,
                "invite_code_limit" integer NOT NULL DEFAULT '5',
                "used_invite_code" text,
                "farty_high_score" integer NOT NULL DEFAULT '0',
                "farty_games_played" integer NOT NULL DEFAULT '0',
                "honey_score" integer NOT NULL DEFAULT '0',
                CONSTRAINT "UQ_b0ec0293d53a1385955f9834d5c" UNIQUE ("address"),
                CONSTRAINT "UQ_a19e76921d5f8829d706a931026" UNIQUE ("invite_code"),
                CONSTRAINT "UQ_eda345e52bcdb28a031c43e0a69" UNIQUE ("address", "invite_code"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
