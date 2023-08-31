import { Injectable } from '@nestjs/common';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { MoreThan } from 'typeorm';
import { CreateGuideInput, CreateGuideOutput } from './dto/create-guide.dto';
import { DeleteGuideInput, DeleteGuideOutput } from './dto/delete-guide.dto';
import { EditGuideInput, EditGuideOutput } from './dto/edit-guide.dto';
import { SelectGuideInput, SelectGuideOutput } from './dto/select-guide.dto';
import { GuideRepository } from './repository/guide.repository';
import { deleteImageFile, selectImageUrl } from 'src/multer/multer.option';
import {
  DetailGuide,
  FindGuideRelatedToNormOutput,
} from './dto/find-guide-related-to-norm.dto';
import {
  SearchDetailGuide,
  SearchGuideInput,
  SearchGuideOutput,
} from './dto/search-guide.dto';
import { User, UserRole } from 'src/user/entity/user.entity';

@Injectable()
export class GuideService {
  constructor(
    private readonly guide: GuideRepository,
    private readonly norm: NormRepository,
  ) {}

  async createGuide(
    { normId, page }: CreateGuideInput,
    image: string,
  ): Promise<CreateGuideOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });
      if (!norm) {
        deleteImageFile(image);
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, guideCount] = await this.guide.findAndCount({ norm });

      if (guideCount + 1 !== +page) {
        deleteImageFile(image);
        return {
          ok: false,
          error: `${page} 페이지 생성 불가 (${
            guideCount + 1
          } 페이지 생성 가능)`,
        };
      }

      await this.guide.save(
        this.guide.create({
          norm,
          page,
          image,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      deleteImageFile(image);
      console.log(error);
      return {
        ok: false,
        error: '가이드 생성 실패',
      };
    }
  }

  async searchGuide({
    page,
    pagesize,
    normid,
  }: SearchGuideInput): Promise<SearchGuideOutput> {
    try {
      const norm = await this.norm.findOne({ id: normid });
      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }

      const [guideList, totalResult] = await this.guide.findAndCount({
        where: { norm },
        skip: (page - 1) * pagesize,
        take: pagesize,
        order: {
          id: 'DESC',
        },
      });

      const result: SearchDetailGuide[] = [];

      guideList.map((guide) => {
        result.push({
          id: guide.id,
          page: guide.page,
          normId: guide.normId,
          imageUrl: selectImageUrl(guide.image),
        });
      });

      return {
        ok: true,
        result,
        totalPage: Math.ceil(totalResult / pagesize),
        totalResult,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '가이드 목록 가져오기 실패',
      };
    }
  }

  async selectGuide({
    normId,
    page,
  }: SelectGuideInput): Promise<SelectGuideOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });

      if (!norm) {
        return {
          ok: false,
          error: '해당 규준을 찾지 못하였습니다.',
        };
      }
      const guide = await this.guide.findOne({ norm, page });

      if (!guide) {
        return {
          ok: false,
          error: '해당 가이드를 찾지 못하였습니다.',
        };
      }
      const imageUrl = selectImageUrl(guide.image);
      return {
        ok: true,
        imageUrl,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '가이드 가져오기 실패',
      };
    }
  }

  async findGuideListRelatedToNorm(
    authUser: User,
    normId: number,
  ): Promise<FindGuideRelatedToNormOutput> {
    try {
      // 면접위원일 경우
      if (authUser.role === UserRole.Admin) {
        const normCount = authUser.group.filter(
          (group) => group.normId === +normId,
        );

        // 자신이 감독하는 공고 가이드가 아닌 다른 가이드 정보 접근 불가
        if (normCount.length < 1) {
          return {
            ok: false,
            error: '접근권한 없음.',
          };
        }
      }

      const norm = await this.norm.findOne({ id: normId });

      if (!norm) {
        return {
          ok: false,
          error: '해당 규준을 찾지 못하였습니다.',
        };
      }
      const [findGuide, totalPage] = await this.guide.findAndCount({ norm });

      if (!findGuide) {
        return {
          ok: false,
          error: '해당 가이드를 찾지 못하였습니다.',
        };
      }

      const guideList: DetailGuide[] = [];

      for (const guide of findGuide) {
        guideList.push({
          imageUrl: selectImageUrl(guide.image),
          page: guide.page,
        });
      }

      return {
        ok: true,
        guideList,
        totalPage,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '규준과 관련된 가이드 가져오기 실패',
      };
    }
  }

  async editGuide(
    { normId, page }: EditGuideInput,
    image: string,
  ): Promise<EditGuideOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });
      if (!norm) {
        deleteImageFile(image);

        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }
      const guide = await this.guide.findOne({ norm, page });
      if (!guide) {
        deleteImageFile(image);
        return {
          ok: false,
          error: '존재하지 않는 가이드 입니다.',
        };
      }

      deleteImageFile(guide.image);
      guide.image = image;
      await this.guide.save(guide);

      return {
        ok: true,
      };
    } catch (error) {
      deleteImageFile(image);
      console.log(error);
      return {
        ok: false,
        error: '가이드 변경 실패',
      };
    }
  }

  async deleteGuide({
    normId,
    page,
  }: DeleteGuideInput): Promise<DeleteGuideOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });
      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }
      const guide = await this.guide.findOne({ norm, page });
      if (!guide) {
        return {
          ok: false,
          error: '존재하지 않는 가이드 입니다.',
        };
      }
      await this.guide.remove(guide);

      const guideList = await this.guide.find({
        where: { norm, page: MoreThan(page) },
      });

      for (const editGuide of guideList) {
        editGuide.page = editGuide.page - 1;
        await this.guide.save(editGuide);
      }

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '가이드 삭제 실패',
      };
    }
  }
}
