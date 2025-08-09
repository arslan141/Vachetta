import { Session } from "next-auth";
import { UserDocument } from "./types";

declare module "next-auth" {
  interface Session {
    user: UserDocument;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string;
    role: 'customer' | 'admin';
  }
}
