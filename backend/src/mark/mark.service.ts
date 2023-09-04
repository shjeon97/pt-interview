import { Injectable } from '@nestjs/common';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { CreateMarkOutput } from './dto/create-mark.dto';
import { SelectMarkOutput } from './dto/select-mark.dto';
import { UpdateMarkInput, UpdateMarkOutput } from './dto/update-mark.dto';
import { MarkRepository } from './repository/mark.repository';
import { Mark } from './entity/mark.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Norm } from 'src/norm/entity/norm.entity';

@Injectable()
export class MarkService {
  constructor(
    @InjectRepository(Mark) private readonly mark: MarkRepository,
    @InjectRepository(Norm) private readonly norm: NormRepository,
    @InjectRepository(User) private readonly user: UserRepository,
  ) {}

  async createMark(tester: User): Promise<CreateMarkOutput> {
    try {
      console.log(tester);
      const exists = await this.mark.findOne({ user: { id: tester.id } });

      if (exists) {
        return {
          ok: false,
          error: '해당 지원자는 이미 마크가 생성되어 있습니다.',
        };
      }

      const norm = await this.norm.findOneOrFail({
        id: tester.group[0].normId,
      });

      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않는 규준 입니다.',
        };
      }

      await this.mark.save(
        this.mark.create([
          {
            user: tester,
            timeRemaining: norm.timeLimit,
          },
        ]),
      );

      const mark = await this.mark.findOneOrFail({ user: tester });

      // tester.isAttend = true;

      // await this.user.save(tester);

      return {
        ok: true,
        mark,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '마크 생성 실패',
      };
    }
  }

  async selectMark(tester: User): Promise<SelectMarkOutput> {
    try {
      const exists = await this.mark.findOne({ user: tester });

      if (exists) {
        return {
          ok: true,
          mark: exists,
        };
      }

      const testerMark = await this.createMark(tester);

      return {
        ok: true,
        mark: testerMark.mark,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '마크 생성 실패',
      };
    }
  }

  async updateMark(
    tester: User,
    { mark, memo, timeRemaining }: UpdateMarkInput,
  ): Promise<UpdateMarkOutput> {
    try {
      const exists = await this.mark.findOne({ user: tester });

      if (!exists) {
        return {
          ok: false,
          error: '존재하지 않는 마크 입니다.',
        };
      }

      if (mark && mark !== '<p></p>') {
        exists.mark = mark;
      }
      if (memo && memo.length >= 1) {
        exists.memo = memo;
      }

      exists.timeRemaining = timeRemaining;

      await this.mark.save(exists);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '마크 업데이트 실패',
      };
    }
  }
  // @Interval(1000)
  // async test() {
  //   // await this.pubSub.publish(NEW_TESTER_STATE, {
  //   //   testerState: {},
  //   // });
  // }
}
