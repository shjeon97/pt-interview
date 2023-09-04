import { Injectable } from '@nestjs/common';
import { deleteImageFile, selectImageUrl } from 'src/multer/multer.option';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { User, UserRole } from 'src/user/entity/user.entity';
import { MoreThan } from 'typeorm';
import {
  CreateOrientationInput,
  CreateOrientationOutput,
} from './dto/create-orientation.dto';
import {
  DeleteOrientationInput,
  DeleteOrientationOutput,
} from './dto/delete-orientation.dto';
import {
  EditOrientationInput,
  EditOrientationOutput,
} from './dto/edit-orientation.dto';
import {
  DetailOrientation,
  SearchOrientationInput,
  SearchOrientationOutput,
} from './dto/search-orientation.dto';
import {
  SelectOrientationInput,
  SelectOrientationOutput,
} from './dto/select-orientation.dto';
import { OrientationRepository } from './repository/orientation.repository';
import { Orientation } from './entity/orientation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Norm } from 'src/norm/entity/norm.entity';

@Injectable()
export class OrientationService {
  constructor(
    @InjectRepository(Orientation)
    private readonly orientation: OrientationRepository,
    @InjectRepository(Norm) private readonly norm: NormRepository,
  ) {}

  async createOrientation(
    { normId, page }: CreateOrientationInput,
    image: string,
  ): Promise<CreateOrientationOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });
      if (!norm) {
        deleteImageFile(image);
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }

      const [_, orientationCount] = await this.orientation.findAndCount({
        norm,
      });
      if (orientationCount + 1 !== +page) {
        deleteImageFile(image);
        return {
          ok: false,
          error: `${page} 페이지 생성 불가 (${
            orientationCount + 1
          } 페이지 생성 가능)`,
        };
      }

      await this.orientation.save(
        this.orientation.create({
          norm,
          page,
          image,
        }),
      );
      console.log(image);

      return {
        ok: true,
      };
    } catch (error) {
      deleteImageFile(image);
      console.log(error);
      return {
        ok: false,
        error: '오리엔테이션 생성 실패',
      };
    }
  }

  async searchOrientation(
    authUser: User,
    { page, pagesize, normid }: SearchOrientationInput,
  ): Promise<SearchOrientationOutput> {
    try {
      const norm = await this.norm.findOne({ id: normid });
      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }

      const [orientationList, totalResult] =
        await this.orientation.findAndCount({
          where: { norm },
          skip: (page - 1) * pagesize,
          take: pagesize,
          order: {
            ...(authUser.role === UserRole.SuperAdmin
              ? { page: 'DESC' }
              : { page: 'ASC' }),
          },
        });

      const result: DetailOrientation[] = [];

      orientationList.map((orientation) => {
        result.push({
          id: orientation.id,
          page: orientation.page,
          normId: orientation.normId,
          imageUrl: selectImageUrl(orientation.image),
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
        error: '오리엔테이션 목록 가져오기 실패',
      };
    }
  }

  async selectOrientation({
    normId,
    page,
  }: SelectOrientationInput): Promise<SelectOrientationOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });
      console.log(normId);

      if (!norm) {
        return {
          ok: false,
          error: '해당 규준을 찾지 못하였습니다.',
        };
      }
      const orientation = await this.orientation.findOne({ norm, page });

      if (!orientation) {
        return {
          ok: false,
          error: '해당 오리엔테이션을 찾지 못하였습니다.',
        };
      }
      const imageUrl = selectImageUrl(orientation.image);
      return {
        ok: true,
        imageUrl,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '오리엔테이션 가져오기 실패',
      };
    }
  }

  async editOrientation(
    { normId, page }: EditOrientationInput,
    image: string,
  ): Promise<EditOrientationOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });
      if (!norm) {
        deleteImageFile(image);
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }
      const orientation = await this.orientation.findOne({ norm, page });
      if (!orientation) {
        deleteImageFile(image);
        return {
          ok: false,
          error: '존재하지 않는 오리엔테이션 입니다.',
        };
      }

      deleteImageFile(orientation.image);
      orientation.image = image;
      await this.orientation.save(orientation);
      return {
        ok: true,
      };
    } catch (error) {
      deleteImageFile(image);
      console.log(error);
      return {
        ok: false,
        error: '오리엔테이션 수정 실패',
      };
    }
  }

  async deleteOrientation({
    normId,
    page,
  }: DeleteOrientationInput): Promise<DeleteOrientationOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });
      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }
      const orientation = await this.orientation.findOne({ norm, page });
      if (!orientation) {
        return {
          ok: false,
          error: '존재하지 않는 오리엔테이션 입니다.',
        };
      }

      await this.orientation.remove(orientation);

      const orientationList = await this.orientation.find({
        where: { norm, page: MoreThan(page) },
      });

      for (const editOrientation of orientationList) {
        editOrientation.page = editOrientation.page - 1;
        await this.orientation.save(editOrientation);
      }

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '오리엔테이션 삭제 실패',
      };
    }
  }
}
