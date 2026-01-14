import { TABLE_NAME } from 'src/shared/enums/database';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixWorkspaceMembersConstraint1234567890 implements MigrationInterface {
  name = 'FixWorkspaceMembersConstraint1234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing constraint if it exists
    await queryRunner.query(`
      ALTER TABLE ${TABLE_NAME.WORKSPACE_MEMBER} 
      DROP CONSTRAINT IF EXISTS "FK_4a7c584ddfe855379598b5e20fd"
    `);

    // Recreate the constraint properly
    await queryRunner.query(`
      ALTER TABLE ${TABLE_NAME.WORKSPACE_MEMBER}
      ADD CONSTRAINT "FK_workspace_members_workspace" 
      FOREIGN KEY (workspace_id) 
      REFERENCES workspace(id) 
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ${TABLE_NAME.WORKSPACE_MEMBER}
      DROP CONSTRAINT IF EXISTS "FK_workspace_members_workspace"
    `);
  }
}
