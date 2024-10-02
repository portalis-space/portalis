import { User } from '@config/dbs/user.model';

export interface IAuth extends User {
  _id: string;
}
