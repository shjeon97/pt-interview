import * as moment from 'moment';
import { EntityRepository, Repository } from 'typeorm';
import { UserLoginSession } from '../entity/user-login-session.entity';

@EntityRepository(UserLoginSession)
export class UserLoginSessionRepository extends Repository<UserLoginSession> {
  async login(userId: number): Promise<boolean> {
    try {
      const exists = await this.find({ userId });
      if (exists) {
        await this.remove(exists);
      }
      await this.save(
        this.create({
          userId,
          lastAccessDate: new Date(),
        }),
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async logout(userId: number): Promise<boolean> {
    try {
      const exists = await this.find({ userId });
      if (exists) {
        await this.remove(exists);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async checkSession(userId: number): Promise<boolean> {
    try {
      const exists = await this.findOne({
        where: { userId },
        order: {
          lastAccessDate: 'DESC',
        },
      });
      if (!exists) {
        return false;
      }
      const lastAccessDate = moment(exists.lastAccessDate);
      const nowAccessDate = moment(new Date());

      const time = nowAccessDate.diff(lastAccessDate) / 1000 / 60;

      if (time > 600) {
        this.logout(userId);
        return false;
      } else {
        exists.lastAccessDate = new Date();
        await this.save(exists);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
