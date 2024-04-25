import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScoreAndProjectInvite1714041662243
  implements MigrationInterface
{
  name = 'AddScoreAndProjectInvite1714041662243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."scores_game_enum" AS ENUM('Farty Bera')
        `);
    await queryRunner.query(`
            CREATE TABLE "scores" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "value" integer NOT NULL DEFAULT '0',
                "game" "public"."scores_game_enum" NOT NULL,
                CONSTRAINT "PK_c36917e6f26293b91d04b8fd521" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "project_invites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "name" text DEFAULT '',
                "invite_code" text NOT NULL,
                "invite_code_limit" integer NOT NULL DEFAULT '1',
                CONSTRAINT "UQ_f6928058ac2125515fd76969ef7" UNIQUE ("invite_code"),
                CONSTRAINT "PK_cd5cde76dc930ec3897f3911f16" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "project_invites"
        `);
    await queryRunner.query(`
            DROP TABLE "scores"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."scores_game_enum"
        `);
  }
}
