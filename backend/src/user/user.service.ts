import { Injectable } from '@nestjs/common';
import { Group } from 'src/group/entity/group.entity';
import { GroupRepository } from 'src/group/repository/group.repository';
import {
  CreateUserInput,
  CreateUserOutput,
} from 'src/user/dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UserProfileOutput } from './dto/user-profile.dto';
import { User, UserRole, UserTestState } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
import { CoreOutput } from 'src/common/dto/output.dto';
import { DeleteUserInput, DeleteUserOutput } from './dto/delete-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserLoginSessionRepository } from './repository/user-login-session.repository';
import { Cron } from '@nestjs/schedule';
import { ILike, LessThan } from 'typeorm';
import * as moment from 'moment';
import { SearchUserInput, SearchUserOutput } from './dto/search-user.dto';
import {
  UploadUserListInput,
  UploadUserListOutput,
} from './dto/upload-user-list.dto';
import { SelectUserInput, SelectUserOutput } from './dto/select-user.dto';
import { MarkRepository } from 'src/mark/repository/mark.repository';
import { MarkService } from 'src/mark/mark.service';
import { EditTesterInput, EditTesterOutput } from './dto/edit-tester.dto.';
import { SocketIoRepository } from 'src/socket-io/repository/socket-io.repository';
import { SocketIoGateway } from 'src/socket-io/socket-io.gateway';

@Injectable()
export class UserService {
  constructor(
    private readonly user: UserRepository,
    private readonly group: GroupRepository,
    private readonly mark: MarkRepository,
    private readonly authService: AuthService,
    private readonly socketIo: SocketIoRepository,
    private readonly markService: MarkService,
    private readonly userLoginSession: UserLoginSessionRepository,
    private readonly socketIoGateway: SocketIoGateway,
  ) {}

  async findUserByRoleAndNameAndPassword(
    role: UserRole,
    name: string,
    password: string,
  ): Promise<CoreOutput> {
    let exists = false;

    if (role != UserRole.SuperAdmin) {
      const oldUser = await this.user.findOne({ name, password });
      if (oldUser) {
        exists = true;
      }
    } else {
      const sameNameUserList = await this.user.find({
        where: { name },
        select: ['password'],
      });

      if (sameNameUserList) {
        for (const sameNameUser of sameNameUserList) {
          exists = await sameNameUser.checkPassword(password);
        }
      }
    }

    if (exists) {
      return {
        ok: false,
        error: '이미 존재하는 유저입니다.',
      };
    } else {
      return {
        ok: true,
      };
    }
  }

  async selectUser(
    authUser: User,
    { id }: SelectUserInput,
  ): Promise<SelectUserOutput> {
    try {
      const user = await this.user.findOne({
        where: { id: id },
        select: ['id', 'password', 'name', 'ptTime', 'testState', 'isAttend'],
        relations: ['group'],
      });

      if (!user) {
        return {
          ok: false,
          error: '존재하지 않은 유저입니다.',
        };
      }

      return {
        ok: true,
        result: user,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '유저 가져오기 실패',
      };
    }
  }

  async uploadUserList({
    userList,
    role,
  }: UploadUserListInput): Promise<UploadUserListOutput> {
    try {
      for (const user of userList) {
        const { ok, error } = await this.createUser({
          name: user.name + '',
          password: user.password + '',
          groupIdList: user.groupIdList,
          role,
          testState:
            role !== UserRole.Tester
              ? UserTestState.Except
              : UserTestState.Pending,
          ...(role === UserRole.Tester && { ptTime: user.ptTime }),
        });
        if (!ok) {
          return {
            ok,
            error: `이름 : ${user.name} | 비밀번호 : ${user.groupIdList}  | 공고 정보 : ${user.groupIdList} | error : ${error} `,
          };
        }
      }
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '유저 업로드 실패',
      };
    }
  }

  async createUser({
    name,
    password,
    role,
    groupIdList,
    testState,
    ptTime,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      name = name.trim().replace('/', '-');
      password = password.trim();
      if (role == UserRole.Tester && !ptTime) {
        return {
          ok: false,
          error: '지원자 면접시간 입력이 필요합니다.',
        };
      }

      if (role == UserRole.Tester && !groupIdList) {
        return {
          ok: false,
          error: '지원자 공고 정보가 필요합니다.',
        };
      }

      const exists = await this.findUserByRoleAndNameAndPassword(
        role,
        name,
        password,
      );
      if (!exists.ok) {
        return {
          ok: false,
          error: exists.error,
        };
      }

      const groupList: Group[] = [];
      if (role == UserRole.Tester) {
        const exists = await this.group.findOne({ id: groupIdList[0] });

        if (!exists) {
          return {
            ok: false,
            error: `공고번호: ${groupIdList[0]} 존재하지 않습니다.`,
          };
        } else {
          groupList.push(exists);
        }
      } else if (groupIdList) {
        for (const groupId of groupIdList) {
          const exists = await this.group.findOne({ id: groupId });
          if (!exists) {
            return {
              ok: false,
              error: `공고번호: ${groupId} 존재하지 않습니다.`,
            };
          } else {
            groupList.push(exists);
          }
        }
      }

      if (role !== UserRole.Tester) {
        testState = UserTestState.Except;
      }

      await this.user.save(
        this.user.create({
          name,
          password,
          role,
          ...(role !== UserRole.SuperAdmin && { group: groupList }),
          testState,
          ptTime,
        }),
      );

      if (role == UserRole.Tester) {
        const user = await this.user.findOneOrFail({
          name,
          password,
          role,
          testState,
          ptTime,
        });
        const mark = await this.markService.createMark(user);
        if (!mark.ok) {
          return {
            ok: false,
            error: mark.error,
          };
        }
      }

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);

      return { ok: false, error: '유저 생성 실패' };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.user.findOneOrFail({ id });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async login({ name, password, role }: LoginInput): Promise<LoginOutput> {
    try {
      name = name.trim().replace('/', '-');
      password = password.trim();
      const user = await this.user.findOne(
        { name, ...(role !== UserRole.SuperAdmin && { password }) },
        { select: ['id', 'password', 'name', 'testState'] },
      );

      if (!user) {
        return {
          ok: false,
          error: '존재하지 않는 유저입니다.',
        };
      } else if (role !== UserRole.SuperAdmin && password !== user.password) {
        return {
          ok: false,
          error: '잘못된 비밀번호입니다.',
        };
      }

      // 최고 관리자 로그인
      if (role === UserRole.SuperAdmin) {
        const passwordCorrect = await user.checkPassword(password);
        if (!passwordCorrect) {
          return {
            ok: false,
            error: '잘못된 비밀번호입니다.',
          };
        }
      }

      // 지원자 로그인
      if (role === UserRole.Tester) {
        const group = await this.group.findOne({ id: user.group[0].id });

        // 응시일자 이전 접속시
        if (new Date() < group.startDate) {
          return {
            ok: false,
            error: '검사 실시 기간이 아닙니다.',
          };
        }

        // 응시일자 이후 접속시 + 응시완료 인원 아닐시
        if (
          new Date() > group.endDate &&
          user.testState !== UserTestState.Done
        ) {
          return {
            ok: false,
            error: '이미 종료된 검사입니다.',
          };
        }

        // 응시일자 1일 이상 지난뒤 접속시 + 응시완료 인원일 경우
        if (
          new Date() >
            new Date(group.endDate.setDate(group.endDate.getDate() + 1)) &&
          user.testState === UserTestState.Done
        ) {
          return {
            ok: false,
            error: 'PT 면접이 완료되었습니다. 감사합니다.',
          };
        }
      }

      const loginSession = await this.userLoginSession.login(user.id);
      if (!loginSession) {
        return {
          ok: false,
          error: '로그인 실패',
        };
      }
      const token = await this.authService.sign(user.id);

      return {
        ok: true,
        token,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '로그인 실패',
      };
    }
  }

  async logout(user: User): Promise<CoreOutput> {
    try {
      const deleteSession = await this.userLoginSession.logout(user.id);
      if (!deleteSession) {
        return {
          ok: false,
          error: '유저세션 삭제 실패',
        };
      }
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '유저세션 삭제 실패',
      };
    }
  }

  async checkSession(userId: number): Promise<boolean> {
    return await this.userLoginSession.checkSession(userId);
  }

  async searchUser({
    page,
    pagesize,
    searchType,
    searchValue,
    role,
  }: SearchUserInput): Promise<SearchUserOutput> {
    try {
      const [userList, totalResult] = await this.user.findAndCount({
        ...(searchType && searchValue && searchType !== 'groupName'
          ? {
              where: {
                [searchType]: ILike(`%${searchValue.trim()}%`),
                role,
              },
            }
          : { where: { role } }),
        ...(searchType !== 'groupName' && {
          skip: (page - 1) * pagesize,
          take: pagesize,
        }),
        order: {
          id: 'DESC',
        },
        select: ['id', 'password', 'name', 'createdAt', 'ptTime', 'testState'],
      });

      if (searchType && searchType === 'groupName') {
        const totalUserListByGroupName = userList.filter((e) =>
          e.group.find((e) =>
            e.name.toLowerCase().includes(searchValue.trim().toLowerCase()),
          ),
        );
        const totalResult = totalUserListByGroupName.length;

        const userListByGroupName = totalUserListByGroupName.splice(
          (page - 1) * pagesize,
          pagesize,
        );

        return {
          ok: true,
          result: userListByGroupName,
          totalPage: Math.ceil(totalResult / pagesize),
          totalResult,
        };
      } else {
        return {
          ok: true,
          result: userList,
          totalPage: Math.ceil(totalResult / pagesize),
          totalResult,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '유저 목록 가져오기 실패',
      };
    }
  }

  async editUser(editUser: EditUserInput): Promise<EditUserOutput> {
    try {
      const user = await this.user.findOne({
        where: { id: editUser.userId },
        select: ['id', 'ptTime', 'isAttend', 'name', 'role', 'password'],
      });

      if (!user) {
        return {
          ok: false,
          error: '존재하지 않는 유저입니다.',
        };
      }

      if (editUser.name) {
        editUser.name = editUser.name.trim().replace('/', '-');
      }

      if (editUser.password) {
        editUser.password = editUser.password.trim();
      }

      if (editUser.name !== user.name && editUser.password) {
        const exists = await this.findUserByRoleAndNameAndPassword(
          user.role,
          editUser.name,
          editUser.password,
        );
        if (!exists.ok) {
          return {
            ok: false,
            error: exists.error,
          };
        } else {
          user.name = editUser.name;
          user.password = editUser.password;
        }
      } else if (editUser.name !== user.name) {
        const exists = await this.findUserByRoleAndNameAndPassword(
          user.role,
          editUser.name,
          user.password,
        );
        if (!exists.ok) {
          return {
            ok: false,
            error: exists.error,
          };
        } else {
          user.name = editUser.name;
        }
      } else if (editUser.password !== user.password) {
        const exists = await this.findUserByRoleAndNameAndPassword(
          user.role,
          user.name,
          editUser.password,
        );
        if (!exists.ok) {
          return {
            ok: false,
            error: exists.error,
          };
        } else {
          user.password = editUser.password;
        }
      }

      if (editUser.ptTime) {
        user.ptTime = editUser.ptTime;
      }

      const groupList: Group[] = [];
      if (user.role == UserRole.Tester) {
        const exists = await this.group.findOne({
          id: editUser.groupIdList[0],
        });

        if (!exists) {
          return {
            ok: false,
            error: `공고번호: ${editUser.groupIdList[0]} 존재하지 않습니다.`,
          };
        } else {
          groupList.push(exists);
        }
      } else if (editUser.groupIdList) {
        for (const groupId of editUser.groupIdList) {
          const exists = await this.group.findOne({ id: groupId });
          if (!exists) {
            return {
              ok: false,
              error: `공고번호: ${groupId} 존재하지 않습니다.`,
            };
          } else {
            groupList.push(exists);
          }
        }
      }

      if (user.role !== UserRole.Tester) {
        user.testState = UserTestState.Except;
      }

      await this.user.save(
        Object.assign(
          user,
          user.role !== UserRole.SuperAdmin && { group: groupList },
        ),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '유저 변경 실패',
      };
    }
  }

  async editTester(
    editTesterInput: EditTesterInput,
  ): Promise<EditTesterOutput> {
    try {
      const user = await this.user.findOne({
        where: { id: editTesterInput.userId },
      });

      if (!user) {
        return {
          ok: false,
          error: '존재하지 않는 유저입니다.',
        };
      }

      const socketIoExists = await this.socketIo.findOne({
        where: {
          user: user,
        },
      });

      if (socketIoExists) {
        await this.socketIo.delete({ user: user });

        this.socketIoGateway.logoutTester(
          socketIoExists,
          '관리자가 지원자님 정보를 수정하였습니다. 다시 접속 부탁드립니다.',
        );
      }

      user.testState = editTesterInput.testState;

      await this.user.save(user);

      const mark = await this.mark.findOne({ where: { user: user } });

      if (!mark) {
        return {
          ok: false,
          error: '존재하지 않는 마크입니다.',
        };
      }

      mark.timeRemaining = editTesterInput.timeRemaining;

      await this.mark.save(mark);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '지원자 정보 수정 실패',
      };
    }
  }

  async deleteUser({ userId }: DeleteUserInput): Promise<DeleteUserOutput> {
    try {
      const user = await this.user.findOne({ id: userId });

      if (!user) {
        return {
          ok: false,
          error: '존재하지 않는 유저 입니다.',
        };
      }

      if (user.role === UserRole.SuperAdmin) {
        return {
          ok: false,
          error: '최고 관리자는 삭제할 수 없습니다.',
        };
      }

      await this.user.remove(user);
      // await this.user.softRemove(user);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '유저 삭제 실패',
      };
    }
  }

  async startTest(authUser: User): Promise<CoreOutput> {
    try {
      const tester = await this.user.findOne({ id: authUser.id });

      if (!tester.testState || tester.testState !== UserTestState.InProgress) {
        tester.testState = UserTestState.InProgress;
        tester.isAttend = true;
        await this.user.save({ ...tester });
      }

      let mark = await this.mark.findOne({ user: tester });

      if (!mark) {
        const createMark = await this.markService.createMark(tester);
        if (!createMark.ok) {
          return {
            ok: false,
            error: createMark.error,
          };
        }
        mark = await this.mark.findOne({ user: tester });
      }
      if (!mark.startDate) {
        mark.startDate = new Date();
      }

      await this.mark.save(mark);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '지원자 검사 시작 실패',
      };
    }
  }

  async endTest(tester: User): Promise<CoreOutput> {
    try {
      const exists = await this.mark.findOne({ user: tester });

      if (!exists) {
        return {
          ok: false,
          error: '존재하지 않는 마크 입니다.',
        };
      }

      exists.endDate = new Date();
      await this.mark.save(exists);

      tester.testState = UserTestState.Done;
      await this.user.save(tester);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '면접 종료 실패',
      };
    }
  }

  @Cron('0 30 5 * * *')
  async deleteSession() {
    const deleteSessionDate = moment().subtract(2, 'days');
    console.log(`${deleteSessionDate} 이전 세션 삭제`);
    const lastAccessDateList = await this.userLoginSession.find({
      where: {
        lastAccessDate: LessThan(deleteSessionDate),
      },
    });
    await this.userLoginSession.remove(lastAccessDateList);
  }
}
