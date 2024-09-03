import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTableWithSocialIds1725307937936
  implements MigrationInterface
{
  name = 'UpdateUserTableWithSocialIds1725307937936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "twitter_id" text
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "discord_id" text
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "discord_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "twitter_id"
        `);
  }
}
