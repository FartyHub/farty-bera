import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateScoresEntity1721823929520 implements MigrationInterface {
  name = 'UpdateScoresEntity1721823929520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "scores"
            ADD "rewards" text NOT NULL DEFAULT ''
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."scores_game_enum"
            RENAME TO "scores_game_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."scores_game_enum" AS ENUM(
                'Farty Bera',
                'Farty Claw',
                'Farty Drop',
                'Farty Slash',
                'Farty Tower'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "scores"
            ALTER COLUMN "game" TYPE "public"."scores_game_enum" USING "game"::"text"::"public"."scores_game_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."scores_game_enum_old"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."scores_game_enum_old" AS ENUM('Farty Bera')
        `);
    await queryRunner.query(`
            ALTER TABLE "scores"
            ALTER COLUMN "game" TYPE "public"."scores_game_enum_old" USING "game"::"text"::"public"."scores_game_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."scores_game_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."scores_game_enum_old"
            RENAME TO "scores_game_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "scores" DROP COLUMN "rewards"
        `);
  }
}
