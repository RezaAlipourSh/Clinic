import { IUser } from "src/modules/user/user-req.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
