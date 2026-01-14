import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/core/base/base.entity';
import { Project } from 'src/modules/project/entities/project.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { WorkspaceMember } from 'src/modules/workspace-member/entities/workspace-member.entity';
import { TABLE_NAME } from 'src/shared/enums/database';
import {
  WORKSPACE_HOW_DID_YOU_HEAR_ABOUT_US,
  WORKSPACE_MANAGER,
  WORKSPACE_MODE,
} from 'src/shared/enums/workspace';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity(TABLE_NAME.WORKSPACE)
export class Workspace extends BaseEntity {
  @ApiProperty({ example: 'workspace name' })
  @Column({ length: 500 })
  title: string;

  @ApiProperty({ example: 'personal' })
  @Column({
    type: 'enum',
    enum: WORKSPACE_MODE,
    default: WORKSPACE_MODE.PERSONAL,
  })
  mode: WORKSPACE_MODE;

  @Column({ name: 'owner_id' })
  @ApiProperty({ name: 'owner' })
  ownerId: string;

  @ApiProperty({ example: 'sales_crm' })
  @Column({ type: 'enum', enum: WORKSPACE_MANAGER, nullable: true })
  manager?: WORKSPACE_MANAGER;

  @ApiProperty({ example: 'sales_crm' })
  @Column({
    type: 'enum',
    enum: WORKSPACE_HOW_DID_YOU_HEAR_ABOUT_US,
    nullable: true,
    name: 'hear_type',
  })
  hearType?: WORKSPACE_HOW_DID_YOU_HEAR_ABOUT_US;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true, default: false })
  launched: boolean;

  @OneToMany(() => WorkspaceMember, (member) => member.workspace)
  members: WorkspaceMember[];

  @ManyToOne(() => User, (user) => user.ownerWorkspaces)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Project, (prj) => prj.workspace)
  projects: Project[];
}
