import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimeToScores1716878084612 implements MigrationInterface {
  name = 'AddTimeToScores1716878084612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "scores"
            ADD "time" text NOT NULL DEFAULT ''
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "scores" DROP COLUMN "time"
        `);
  }
}
