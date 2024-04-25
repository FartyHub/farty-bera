import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable1714047932252 implements MigrationInterface {
  name = 'UpdateUserTable1714047932252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_eda345e52bcdb28a031c43e0a69"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_eda345e52bcdb28a031c43e0a69" UNIQUE ("address", "invite_code")
        `);
  }
}
