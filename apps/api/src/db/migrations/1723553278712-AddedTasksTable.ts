import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTasksTable1723553278712 implements MigrationInterface {
  name = 'AddedTasksTable1723553278712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "title" text NOT NULL,
                "description" text NOT NULL,
                "type" character varying NOT NULL,
                "value" integer NOT NULL,
                CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "tasks_score" integer NOT NULL DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "tasks_score"
        `);
    await queryRunner.query(`
            DROP TABLE "tasks"
        `);
  }
}
