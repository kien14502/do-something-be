import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInviteByIdToWorkspaceMember1770652680907 implements MigrationInterface {
  name = 'AddInviteByIdColumn1234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tb_workspace_member" 
            ADD "invite_by_id" uuid
        `);

    await queryRunner.query(`
            UPDATE "tb_workspace_member" wm
            SET "invite_by_id" = (
                SELECT "created_by_id"
                FROM "tb_workspace" w
                WHERE w."id" = wm."workspace_id"
            )
            WHERE "invite_by_id" IS NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "tb_workspace_member" 
            ALTER COLUMN "invite_by_id" SET NOT NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "tb_workspace_member"
            ADD CONSTRAINT "FK_workspace_member_invite_by"
            FOREIGN KEY ("invite_by_id") 
            REFERENCES "tb_user"("id")
            ON DELETE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tb_workspace_member" 
            DROP CONSTRAINT "FK_workspace_member_invite_by"
        `);

    await queryRunner.query(`
            ALTER TABLE "tb_workspace_member" 
            DROP COLUMN "invite_by_id"
        `);
  }
}
