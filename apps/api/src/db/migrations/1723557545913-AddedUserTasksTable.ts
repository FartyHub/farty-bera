import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserTasksTable1723557545913 implements MigrationInterface {
  name = 'AddedUserTasksTable1723557545913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user-tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_id" uuid,
                "task_id" uuid,
                CONSTRAINT "PK_d17340aabf5ff164640a4c1c394" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user-tasks"
            ADD CONSTRAINT "FK_c310f8f9ec5043f5e1ee151e1ea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user-tasks"
            ADD CONSTRAINT "FK_030aae7cb3c2535e07acf346b86" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user-tasks" DROP CONSTRAINT "FK_030aae7cb3c2535e07acf346b86"
        `);
    await queryRunner.query(`
            ALTER TABLE "user-tasks" DROP CONSTRAINT "FK_c310f8f9ec5043f5e1ee151e1ea"
        `);
    await queryRunner.query(`
            DROP TABLE "user-tasks"
        `);
  }
}
