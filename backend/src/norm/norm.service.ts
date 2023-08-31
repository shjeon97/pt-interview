import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { AllNormOutput } from './dto/all-norm.dto';
import { CreateNormInput, CreateNormOutput } from './dto/create-norm.dto';
import { DeleteNormInput, DeleteNormOutput } from './dto/delete-norm.dto';
import { EditNormInput, EditNormOutput } from './dto/edit-norm.dto';
import { SelectNormInput, SelectNormOutput } from './dto/select-norm.dto';
import { NormRepository } from './repository/norm.repository';
import * as excel from 'exceljs';
import { SearchNormInput, SearchNormOutput } from './dto/search-norm.dto';
import { OrientationRepository } from 'src/orientation/repository/orientation.repository';
import { QuestionRepository } from 'src/question/repository/question.repository';
import { GuideRepository } from 'src/guide/repository/guide.repository';
import { ILike } from 'typeorm';

@Injectable()
export class NormService {
  constructor(
    private readonly norm: NormRepository,
    private readonly orientation: OrientationRepository,
    private readonly question: QuestionRepository,
    private readonly guide: GuideRepository,
  ) {}

  async createNorm({
    name,
    timeLimit,
  }: CreateNormInput): Promise<CreateNormOutput> {
    try {
      const exists = await this.norm.findOne({ name });
      if (exists) {
        return {
          ok: false,
          error: `이미 존재하는 규준 이름입니다.`,
        };
      }
      await this.norm.save(this.norm.create({ name, timeLimit }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '규준 생성 실패',
      };
    }
  }

  async searchNorm({
    page,
    pagesize,
    searchType,
    searchValue,
  }: SearchNormInput): Promise<SearchNormOutput> {
    try {
      const [normList, totalResult] = await this.norm.findAndCount({
        ...(searchType &&
          searchValue && {
            where: { [searchType]: ILike(`%${searchValue.trim()}%`) },
          }),
        skip: (page - 1) * pagesize,
        take: pagesize,
        order: {
          id: 'DESC',
        },
      });

      return {
        ok: true,
        result: normList,
        totalPage: Math.ceil(totalResult / pagesize),
        totalResult,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '규준 목록 가져오기 실패',
      };
    }
  }

  async downloadNorm(res) {
    try {
      const downloadPath = join(
        process.cwd(),
        `/public/template/download-template-norm.xlsx`,
      );
      if (!existsSync(downloadPath)) {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      }
      const workbook = new excel.Workbook();
      await workbook.xlsx.readFile(downloadPath);
      const worksheet = workbook.worksheets[0];

      const normList = await this.norm.find();

      normList.map((norm, index: number) => {
        worksheet.insertRow(index + 2, [norm.id, norm.name]);
      });

      // 해당 컨텐츠가 웹페이지의 일부인지, attachment로써 다운로드 되거나 로컬에 저장될 용도인지 지정
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'download-admin.xlsx',
      );
      // 반환도리 컨텐츠 유청 지정
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      return await workbook.xlsx.write(res).then(function () {
        res.status(200);
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async selectNorm({ id }: SelectNormInput): Promise<SelectNormOutput> {
    try {
      const norm = await this.norm.findOne({ id });

      if (!norm) {
        return {
          ok: false,
          error: '해당 규준을 찾지 못하였습니다.',
        };
      }
      return {
        ok: true,
        result: norm,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '규준 가져오기 실패',
      };
    }
  }

  async allNorm(): Promise<AllNormOutput> {
    try {
      const allNorm = await this.norm.find();
      return {
        ok: true,
        result: allNorm,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '모든 규준 가져오기 실패',
      };
    }
  }

  async editNorm(editNorm: EditNormInput): Promise<EditNormOutput> {
    try {
      const norm = await this.norm.findOne({ id: editNorm.normId });
      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }

      if (editNorm.name !== norm.name) {
        editNorm.name = editNorm.name.trim().replace('/', '-');
        const oldNorm = await this.norm.findOne({ name: editNorm.name });

        if (oldNorm) {
          return {
            ok: false,
            error: '이미 존재하는 규준 이름입니다.',
          };
        } else {
          norm.name = editNorm.name;
        }
      }

      if (editNorm.timeLimit) {
        norm.timeLimit = editNorm.timeLimit;
      }

      await this.norm.save(norm);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '규준 변경 실패',
      };
    }
  }

  async deleteNorm({ id }: DeleteNormInput): Promise<DeleteNormOutput> {
    try {
      const norm = await this.norm.findOne({ id });
      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }

      const orientation = await this.orientation.find({ norm });
      await this.orientation.remove(orientation);

      const question = await this.question.find({ norm });
      await this.question.remove(question);

      const guide = await this.guide.find({ norm });
      await this.guide.remove(guide);

      await this.norm.remove(norm);

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '규준 삭제 실패',
      };
    }
  }
}
