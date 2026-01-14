import { CreateStatusDto } from 'src/modules/project-status/dtos/create-status.dto';

export const DEFAULT_STATUSES: Omit<CreateStatusDto, 'projectId'>[] = [
  { color: '#94A3B8', name: 'to do', position: 1 },
  { color: '#3B82F6', name: 'in progress', position: 2 },
  { color: '#10B981', name: 'done', position: 3 },
];
