<!-- exception -->

```
// 1. Resource not found
throw new ResourceNotFoundException('User', userId);

// 2. Resource already exists
throw new ResourceAlreadyExistsException('User', 'email', email);

// 3. Business logic error
throw new BusinessException('Cannot delete admin users');

// 4. Validation error
throw new ValidationException('Invalid email format');
throw new ValidationException(['Email is required', 'Password too short']);

// 5. Authentication errors
throw new InvalidCredentialsException('Invalid email or password');
throw new UnauthorizedAccessException('Token is missing');
throw new TokenExpiredException('Your session has expired');
throw new InvalidTokenException('Malformed token');

// 6. Authorization error
throw new ForbiddenAccessException('Admin access required');

// 7. External service error
throw new ExternalServiceException('Payment Gateway', 'Connection timeout');

// 8. Rate limiting
throw new RateLimitException('Too many requests, please try again later');

// 9. Payment required
throw new PaymentRequiredException('Subscription required');

// 10. Database error
throw new DatabaseException('Failed to connect to database');

// 11. File upload error
throw new FileUploadException('File size exceeds limit');
```

<!-- Database -->

-- Users and Authentication
CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL,
username VARCHAR(100) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
full_name VARCHAR(255),
avatar_url VARCHAR(500),
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizations/Workspaces
CREATE TABLE organizations (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
slug VARCHAR(100) UNIQUE NOT NULL,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organization Members
CREATE TABLE organization_members (
id SERIAL PRIMARY KEY,
organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'member'
joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(organization_id, user_id)
);

-- Projects
CREATE TABLE projects (
id SERIAL PRIMARY KEY,
organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
name VARCHAR(255) NOT NULL,
key VARCHAR(10) NOT NULL, -- e.g., 'PROJ', 'DEV'
description TEXT,
project_type VARCHAR(50) DEFAULT 'scrum', -- 'scrum', 'kanban', 'bug_tracking'
lead_id INTEGER REFERENCES users(id),
avatar_url VARCHAR(500),
is_archived BOOLEAN DEFAULT false,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(organization_id, key)
);

-- Project Members
CREATE TABLE project_members (
id SERIAL PRIMARY KEY,
project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
role VARCHAR(50) NOT NULL, -- 'admin', 'developer', 'viewer'
joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(project_id, user_id)
);

-- Issue Types
CREATE TABLE issue_types (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL,
description TEXT,
icon VARCHAR(100),
color VARCHAR(7), -- hex color
is_subtask BOOLEAN DEFAULT false,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default issue types
INSERT INTO issue_types (name, description, icon, color, is_subtask) VALUES
('Story', 'User story', 'book', '#65BA43', false),
('Task', 'A task that needs to be done', 'check-square', '#4BADE8', false),
('Bug', 'A problem that needs to be fixed', 'alert-circle', '#E44D42', false),
('Epic', 'A large body of work', 'zap', '#904EE2', false),
('Subtask', 'A subtask of another issue', 'git-branch', '#7F8FA4', true);

-- Statuses
CREATE TABLE statuses (
id SERIAL PRIMARY KEY,
project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
name VARCHAR(100) NOT NULL,
category VARCHAR(50) NOT NULL, -- 'todo', 'in_progress', 'done'
color VARCHAR(7),
position INTEGER NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Priorities
CREATE TABLE priorities (
id SERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL,
description TEXT,
icon VARCHAR(100),
color VARCHAR(7),
level INTEGER NOT NULL, -- 1 (highest) to 5 (lowest)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default priorities
INSERT INTO priorities (name, description, icon, color, level) VALUES
('Highest', 'Highest priority', 'arrow-up', '#E44D42', 1),
('High', 'High priority', 'arrow-up', '#EA7D24', 2),
('Medium', 'Medium priority', 'minus', '#E97F33', 3),
('Low', 'Low priority', 'arrow-down', '#2D8738', 4),
('Lowest', 'Lowest priority', 'arrow-down', '#57A55A', 5);

-- Issues (Tasks, Stories, Bugs, etc.)
CREATE TABLE issues (
id SERIAL PRIMARY KEY,
project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
issue_number INTEGER NOT NULL, -- auto-increment per project
issue_key VARCHAR(50) NOT NULL, -- e.g., 'PROJ-123'
issue_type_id INTEGER REFERENCES issue_types(id),
title VARCHAR(500) NOT NULL,
description TEXT,
status_id INTEGER REFERENCES statuses(id),
priority_id INTEGER REFERENCES priorities(id),
reporter_id INTEGER REFERENCES users(id),
assignee_id INTEGER REFERENCES users(id),
parent_issue_id INTEGER REFERENCES issues(id), -- for subtasks and epics
story_points INTEGER,
estimate_hours DECIMAL(10, 2),
time_spent_hours DECIMAL(10, 2) DEFAULT 0,
due_date DATE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
resolved_at TIMESTAMP,
UNIQUE(project_id, issue_number)
);

-- Sprints
CREATE TABLE sprints (
id SERIAL PRIMARY KEY,
project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
name VARCHAR(255) NOT NULL,
goal TEXT,
start_date DATE,
end_date DATE,
status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'active', 'completed'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sprint Issues
CREATE TABLE sprint_issues (
id SERIAL PRIMARY KEY,
sprint_id INTEGER REFERENCES sprints(id) ON DELETE CASCADE,
issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(sprint_id, issue_id)
);

-- Comments
CREATE TABLE comments (
id SERIAL PRIMARY KEY,
issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(id),
content TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attachments
CREATE TABLE attachments (
id SERIAL PRIMARY KEY,
issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(id),
filename VARCHAR(255) NOT NULL,
file_url VARCHAR(1000) NOT NULL,
file_size INTEGER, -- in bytes
mime_type VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Labels
CREATE TABLE labels (
id SERIAL PRIMARY KEY,
project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
name VARCHAR(100) NOT NULL,
color VARCHAR(7),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(project_id, name)
);

-- Issue Labels
CREATE TABLE issue_labels (
id SERIAL PRIMARY KEY,
issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
label_id INTEGER REFERENCES labels(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(issue_id, label_id)
);

-- Watchers (users watching issues)
CREATE TABLE watchers (
id SERIAL PRIMARY KEY,
issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
UNIQUE(issue_id, user_id)
);

-- Activity Log
CREATE TABLE activity_log (
id SERIAL PRIMARY KEY,
issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(id),
action_type VARCHAR(100) NOT NULL, -- 'created', 'updated', 'commented', 'status_changed'
field_name VARCHAR(100), -- which field changed
old_value TEXT,
new_value TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
type VARCHAR(100) NOT NULL, -- 'assigned', 'mentioned', 'commented'
message TEXT NOT NULL,
is_read BOOLEAN DEFAULT false,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_issues_project_id ON issues(project_id);
CREATE INDEX idx_issues_assignee_id ON issues(assignee_id);
CREATE INDEX idx_issues_status_id ON issues(status_id);
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_comments_issue_id ON comments(issue_id);
CREATE INDEX idx_activity_log_issue_id ON activity_log(issue_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_sprint_issues_sprint_id ON sprint_issues(sprint_id);
