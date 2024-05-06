import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserDisplayName1714989271457 implements MigrationInterface {
  name = 'AddUserDisplayName1714989271457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "display_name" text NOT NULL DEFAULT 'Farty Bera'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "display_name"
        `);
  }
}
