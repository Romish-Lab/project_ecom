import { TPayload } from "../utils/jwt.utils";

declare global {
  namespace Express {
    interface Request {
      user?: TPayload;
    }
  }
}

export {};
