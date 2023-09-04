import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarkRepository } from 'src/mark/repository/mark.repository';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { User, UserRole } from 'src/user/entity/user.entity';
import { User_Group } from 'src/user/entity/user_group.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { ILike, In, Repository } from 'typeorm';
import { SearchGroupInput, SearchGroupOutput } from './dto/search-group.dto';
import { CreateGroupInput, CreateGroupOutput } from './dto/create-group.dto';
import { DeleteGroupInput, DeleteGroupOutput } from './dto/delete-group.dto';
import {
  DetailGroupInput,
  DetailGroupOutput,
  DetailUser,
} from './dto/detail-group.dto';
import { EditGroupInput, EditGroupOutput } from './dto/edit-group.dto';
import { SelectGroupInput, SelectGroupOutput } from './dto/select-group.dto';
import { GroupRepository } from './repository/group.repository';
import { AllGroupOutput } from './dto/all-group.dto';
import { join } from 'path';
import { existsSync } from 'fs';
import * as excel from 'exceljs';
import {
  UploadGroupListInput,
  UploadGroupListOutput,
} from './dto/upload-group-list.dto';
import { Group } from './entity/group.entity';
import { Norm } from 'src/norm/entity/norm.entity';
import { Mark } from 'src/mark/entity/mark.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly group: GroupRepository,
    @InjectRepository(Norm) private readonly norm: NormRepository,
    @InjectRepository(User) private readonly user: UserRepository,
    @InjectRepository(Mark) private readonly mark: MarkRepository,
    @InjectRepository(User_Group)
    private readonly user_group: Repository<User_Group>,
  ) {}

  async createGroup({
    normId,
    name,
    startDate,
    endDate,
  }: CreateGroupInput): Promise<CreateGroupOutput> {
    try {
      name = name.trim().replace('/', '-');

      const oldGroup = await this.group.findByName(name);

      if (oldGroup) {
        return {
          ok: false,
          error: '이미 존재하는 공고 이름입니다.',
        };
      }

      const norm = await this.norm.findOne({ id: normId });

      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않은 규준입니다.',
        };
      }

      await this.group.save(
        this.group.create({
          norm,
          name,
          startDate,
          endDate,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '공고 생성 실패',
      };
    }
  }
  async uploadGroupList({
    groupList,
  }: UploadGroupListInput): Promise<UploadGroupListOutput> {
    try {
      for (const group of groupList) {
        const { ok, error } = await this.createGroup({
          name: group.name + '',
          normId: +group.normId,
          startDate: group.startDate,
          endDate: group.endDate,
        });
        if (!ok) {
          return {
            ok,
            error: `이름 : ${group.name} | 규준 ID : ${group.normId}  | 시작일 : ${group.startDate} | 종료일 : ${group.endDate} | error : ${error} `,
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
        error: '공고 업로드 실패',
      };
    }
  }

  async allGroup(): Promise<AllGroupOutput> {
    try {
      const allGroup = await this.group.find();
      return {
        ok: true,
        result: allGroup,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '모든 공고 가져오기 실패',
      };
    }
  }

  async downloadGroup(res) {
    try {
      const downloadPath = join(
        process.cwd(),
        `/public/template/download-template-group.xlsx`,
      );
      if (!existsSync(downloadPath)) {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      }
      const workbook = new excel.Workbook();
      await workbook.xlsx.readFile(downloadPath);
      const worksheet = workbook.worksheets[0];

      const groupList = await this.group.find();

      groupList.map((group, index: number) => {
        worksheet.insertRow(index + 2, [group.id, group.name]);
      });

      // 해당 컨텐츠가 웹페이지의 일부인지, attachment로써 다운로드 되거나 로컬에 저장될 용도인지 지정
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'download-group.xlsx',
      );
      // 반환도리 컨텐츠 유청 지정
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      // res.attachment('download-group.xlsx');

      return await workbook.xlsx.write(res).then(function () {
        res.status(200);
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async editGroup(editGroup: EditGroupInput): Promise<EditGroupOutput> {
    try {
      const group = await this.group.findOne({ id: editGroup.groupId });

      if (!group) {
        return {
          ok: false,
          error: '존재하지 않는 공고입니다.',
        };
      }

      if (editGroup.name !== group.name) {
        editGroup.name = editGroup.name.trim().replace('/', '-');
        const oldGroup = await this.group.findByName(editGroup.name);
        if (oldGroup?.id) {
          return {
            ok: false,
            error: '이미 존재하는 공고 이름입니다.',
          };
        }
        group.name = editGroup.name;
      }

      if (editGroup.normId) {
        const norm = await this.norm.findOne({ id: editGroup.normId });
        if (!norm) {
          return {
            ok: false,
            error: '존재하지 않는 규준입니다.',
          };
        }
        group.norm = norm;
      }

      if (editGroup.startDate) {
        group.startDate = editGroup.startDate;
      }

      if (editGroup.endDate) {
        group.endDate = editGroup.endDate;
      }

      await this.group.save([
        {
          ...group,
        },
      ]);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '공고 수정 실패',
      };
    }
  }

  async deleteGroup({ id }: DeleteGroupInput): Promise<DeleteGroupOutput> {
    try {
      const group = await this.group.findOne({ id });
      if (!group) {
        return {
          ok: false,
          error: '존재하지 않은 공고입니다.',
        };
      }

      const userList = await this.user_group.find({ groupId: group.id });

      if (userList[0]) {
        return {
          ok: false,
          error: '지원자 또는 면접관이 존재하는 공고는 삭제 할 수 없습니다.',
        };
      }

      await this.group.delete({ id: group.id });

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '공고 삭제 실패',
      };
    }
  }

  async selectGroup(
    authUser: User,
    { id }: SelectGroupInput,
  ): Promise<SelectGroupOutput> {
    try {
      const group = await this.group.findOne({ id });
      if (!group) {
        return {
          ok: false,
          error: '존재하지 않은 공고입니다.',
        };
      }
      return {
        ok: true,
        result: group,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '공고 가져오기 실패',
      };
    }
  }

  async searchGroup(
    authUser: User,
    { page, pagesize, searchType, searchValue }: SearchGroupInput,
  ): Promise<SearchGroupOutput> {
    try {
      if (authUser.role === UserRole.SuperAdmin) {
        const [groupList, totalResult] = await this.group.findAndCount({
          ...(searchType &&
            searchValue && {
              where: { [searchType]: ILike(`%${searchValue.trim()}%`) },
            }),
          skip: (page - 1) * pagesize,
          take: pagesize,
          relations: ['norm'],
          order: {
            startDate: 'DESC',
          },
        });

        return {
          ok: true,
          result: groupList,
          totalPage: Math.ceil(totalResult / pagesize),
          totalResult,
        };
      } else {
        const groupIdList: number[] = [];
        authUser.group.map((group) => {
          groupIdList.push(group.id);
        });
        const [groupList, totalResult] = await this.group.findAndCount({
          ...(searchType && searchValue
            ? {
                where: {
                  [searchType]: ILike(`%${searchValue.trim()}%`),
                  id: In(groupIdList),
                },
              }
            : { where: { id: In(groupIdList) } }),
          skip: (page - 1) * pagesize,
          take: pagesize,
          relations: ['norm'],
          order: {
            startDate: 'DESC',
          },
        });

        return {
          ok: true,
          result: groupList,
          totalPage: Math.ceil(totalResult / pagesize),
          totalResult,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '모든 공고 가져오기 실패',
      };
    }
  }

  async detailGroup(
    authUser: User,
    { groupId }: DetailGroupInput,
  ): Promise<DetailGroupOutput> {
    try {
      // 면접위원일 경우
      if (authUser.role === UserRole.Admin) {
        const groupCount = authUser.group.filter(
          (group) => group.id === +groupId,
        );

        // 자신이 감독하는 공고가 아닌 다른 공고 정보 접근 불가
        if (groupCount.length < 1) {
          return {
            ok: false,
            error: '접근권한 없음.',
          };
        }
      }
      const group = await this.group.findOne({ id: groupId });

      if (!group) {
        return {
          ok: false,
          error: '존재하지 않은 공고입니다.',
        };
      }

      const testerList = await this.user.query(
        `select * from "user" u inner join user_group ug 
      ON u.id = ug."userId" 
      where ug."groupId" = ${groupId} and u."role" = '${UserRole.Tester}'`,
      );

      const detailUserList: DetailUser[] = [];

      for (const user of testerList) {
        const mark = await this.mark.findOne({ user });
        if (mark && user) {
          detailUserList.push({ user, mark });
        } else if (user) {
          detailUserList.push({ user });
        }
      }

      detailUserList.sort(function (a, b) {
        if (a.user.ptTime > b.user.ptTime) {
          return 1;
        }
        if (a.user.ptTime < b.user.ptTime) {
          return -1;
        }
        return 0;
      });
      return {
        ok: true,
        result: {
          detailUserList,
          group,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '공고 내용 가져오기 실패',
      };
    }
  }
}
