// types/express.d.ts
import { CurrentUser } from 'src/shared/interfaces/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: CurrentUser;
      id: string;
    }
  }
}
