// src/express.d.ts
import { User } from '../../entities/User'; // Or your actual user type

declare global {
  namespace Express {
    interface Request {
      user?: User; // Define the shape of user if needed
    }
  }
}
