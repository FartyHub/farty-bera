import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTaskWithValue1725307826573
  implements MigrationInterface
{
  name = 'UpdateUserTaskWithValue1725307826573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user-tasks"
            ADD "value" integer NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user-tasks" DROP COLUMN "value"
        `);
  }
}
