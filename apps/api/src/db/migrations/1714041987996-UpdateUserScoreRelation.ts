import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserScoreRelation1714041987996
  implements MigrationInterface
{
  name = 'UpdateUserScoreRelation1714041987996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "scores"
            ADD "user_address" text NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "scores" DROP COLUMN "user_address"
        `);
  }
}
