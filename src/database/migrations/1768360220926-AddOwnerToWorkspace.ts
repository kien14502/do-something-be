import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOwnerToWorkspace1768360220926 implements MigrationInterface {
  name = 'AddOwnerToWorkspace1768360220926';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Rename priority_id to priority (Issue table)
    await queryRunner.query(
      `ALTER TABLE "tb_issue" RENAME COLUMN "priority_id" TO "priority_old"`,
    );

    // 2. Add owner_id column as NULLABLE first
    await queryRunner.query(`ALTER TABLE "tb_workspace" ADD "owner_id" uuid`);

    // 3. Update owner_id with data from workspace_member
    // Option A: Set owner_id từ member có role OWNER
    await queryRunner.query(`
      UPDATE tb_workspace w
      SET owner_id = (
        SELECT user_id 
        FROM tb_workspace_member m 
        WHERE m.workspace_id = w.id 
        AND m.role = 'owner'
        LIMIT 1
      )
      WHERE owner_id IS NULL
    `);

    // Option B: Nếu không có OWNER role, lấy member đầu tiên
    await queryRunner.query(`
      UPDATE tb_workspace w
      SET owner_id = (
        SELECT user_id 
        FROM tb_workspace_member m 
        WHERE m.workspace_id = w.id 
        LIMIT 1
      )
      WHERE owner_id IS NULL
    `);

    // 4. Set NOT NULL constraint sau khi đã có data
    await queryRunner.query(
      `ALTER TABLE "tb_workspace" ALTER COLUMN "owner_id" SET NOT NULL`,
    );

    // 5. Create ISSUE_PRIORITY enum
    await queryRunner.query(
      `CREATE TYPE "public"."ISSUE_PRIORITY" AS ENUM('urgent', 'high', 'normal', 'low')`,
    );

    // 6. Add new priority column with enum type
    await queryRunner.query(
      `ALTER TABLE "tb_issue" ADD "priority" "public"."ISSUE_PRIORITY" DEFAULT 'normal'`,
    );

    // 7. Migrate data from old priority to new priority (if needed)
    // Uncomment if you need to migrate existing data
    // await queryRunner.query(`
    //   UPDATE tb_issue
    //   SET priority =
    //     CASE
    //       WHEN priority_old = 'urgent' THEN 'urgent'::"public"."ISSUE_PRIORITY"
    //       WHEN priority_old = 'high' THEN 'high'::"public"."ISSUE_PRIORITY"
    //       WHEN priority_old = 'normal' THEN 'normal'::"public"."ISSUE_PRIORITY"
    //       WHEN priority_old = 'low' THEN 'low'::"public"."ISSUE_PRIORITY"
    //       ELSE 'normal'::"public"."ISSUE_PRIORITY"
    //     END
    //   WHERE priority IS NULL
    // `);

    // 8. Drop old priority column
    await queryRunner.query(
      `ALTER TABLE "tb_issue" DROP COLUMN "priority_old"`,
    );

    // 9. Handle workspace_member status_invite
    await queryRunner.query(
      `ALTER TABLE "tb_workspace_member" RENAME COLUMN "status_invite" TO "status_invite_old"`,
    );

    // 10. Create WORKSPACE_STATUS_INVITE enum
    await queryRunner.query(
      `CREATE TYPE "public"."WORKSPACE_STATUS_INVITE" AS ENUM('accepted', 'pending', 'rejected')`,
    );

    // 11. Add new status_invite with enum
    await queryRunner.query(
      `ALTER TABLE "tb_workspace_member" ADD "status_invite" "public"."WORKSPACE_STATUS_INVITE" DEFAULT 'pending'`,
    );

    // 12. Migrate status_invite data
    await queryRunner.query(`
      UPDATE tb_workspace_member 
      SET status_invite = 
        CASE 
          WHEN status_invite_old = 'accepted' THEN 'accepted'::"public"."WORKSPACE_STATUS_INVITE"
          WHEN status_invite_old = 'pending' THEN 'pending'::"public"."WORKSPACE_STATUS_INVITE"
          WHEN status_invite_old = 'rejected' THEN 'rejected'::"public"."WORKSPACE_STATUS_INVITE"
          ELSE 'pending'::"public"."WORKSPACE_STATUS_INVITE"
        END
      WHERE status_invite IS NULL
    `);

    // 13. Set NOT NULL for status_invite
    await queryRunner.query(
      `ALTER TABLE "tb_workspace_member" ALTER COLUMN "status_invite" SET NOT NULL`,
    );

    // 14. Drop old status_invite column
    await queryRunner.query(
      `ALTER TABLE "tb_workspace_member" DROP COLUMN "status_invite_old"`,
    );

    // 15. Add foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "tb_workspace" ADD CONSTRAINT "FK_workspace_owner" 
       FOREIGN KEY ("owner_id") REFERENCES "tb_user"("id") 
       ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 16. Add index for performance
    await queryRunner.query(
      `CREATE INDEX "IDX_workspace_owner" ON "tb_workspace" ("owner_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`DROP INDEX "public"."IDX_workspace_owner"`);

    // Drop foreign key
    await queryRunner.query(
      `ALTER TABLE "tb_workspace" DROP CONSTRAINT "FK_workspace_owner"`,
    );

    // Revert workspace_member status_invite
    await queryRunner.query(
      `ALTER TABLE "tb_workspace_member" DROP COLUMN "status_invite"`,
    );
    await queryRunner.query(`DROP TYPE "public"."WORKSPACE_STATUS_INVITE"`);
    await queryRunner.query(
      `ALTER TABLE "tb_workspace_member" ADD "status_invite" character varying NOT NULL DEFAULT 'pending'`,
    );

    // Revert issue priority
    await queryRunner.query(`ALTER TABLE "tb_issue" DROP COLUMN "priority"`);
    await queryRunner.query(`DROP TYPE "public"."ISSUE_PRIORITY"`);
    await queryRunner.query(
      `ALTER TABLE "tb_issue" ADD "priority_id" character varying`,
    );

    // Drop owner_id
    await queryRunner.query(
      `ALTER TABLE "tb_workspace" DROP COLUMN "owner_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tb_workspace" ADD CONSTRAINT "FK_workspace_owner" FOREIGN KEY ("owner_id") REFERENCES "tb_user"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_workspace_owner" ON "tb_workspace" ("owner_id")`,
    );
  }
}
