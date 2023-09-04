import { Injectable } from '@nestjs/common';
import { deleteImageFile, selectImageUrl } from 'src/multer/multer.option';
import { NormRepository } from 'src/norm/repository/norm.repository';
import { CreateOrientationOutput } from 'src/orientation/dto/create-orientation.dto';
import { User, UserRole } from 'src/user/entity/user.entity';
import { MoreThan } from 'typeorm';
import { CreateQuestionInput } from './dto/create-question.dto';
import {
  DeleteQuestionInput,
  DeleteQuestionOutput,
} from './dto/delete-question.dto';
import { EditQuestionInput, EditQuestionOutput } from './dto/edit-question.dto';
import {
  DetailQuestion,
  SearchQuestionInput,
  SearchQuestionOutput,
} from './dto/search-question.dto';
import {
  SelectQuestionInput,
  SelectQuestionOutput,
} from './dto/select-question.dto';
import { QuestionRepository } from './repository/question.repository';
import { Question } from './entity/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Norm } from 'src/norm/entity/norm.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private readonly question: QuestionRepository,
    @InjectRepository(Norm) private readonly norm: NormRepository,
  ) {}

  async createQuestion(
    { normId, page }: CreateQuestionInput,
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

      const [_, questionCount] = await this.question.findAndCount({ norm });

      if (questionCount + 1 !== +page) {
        deleteImageFile(image);
        return {
          ok: false,
          error: `${page} 페이지 생성 불가 (${
            questionCount + 1
          } 페이지 생성 가능)`,
        };
      }

      await this.question.save(
        this.question.create({
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
        error: '문항 생성 실패',
      };
    }
  }

  async searchQuestion(
    authUser: User,
    { page, pagesize, normid }: SearchQuestionInput,
  ): Promise<SearchQuestionOutput> {
    try {
      const norm = await this.norm.findOne({ id: normid });
      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }

      const [questionList, totalResult] = await this.question.findAndCount({
        where: { norm },
        skip: (page - 1) * pagesize,
        take: pagesize,
        order: {
          ...(authUser.role === UserRole.SuperAdmin
            ? { page: 'DESC' }
            : { page: 'ASC' }),
        },
      });

      const result: DetailQuestion[] = [];

      questionList.map((question) => {
        result.push({
          id: question.id,
          page: question.page,
          normId: question.normId,
          imageUrl: selectImageUrl(question.image),
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
        error: '문제 목록 가져오기 실패',
      };
    }
  }

  async selectQuestion({
    normId,
    page,
  }: SelectQuestionInput): Promise<SelectQuestionOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });

      if (!norm) {
        return {
          ok: false,
          error: '해당 규준을 찾지 못하였습니다.',
        };
      }
      const question = await this.question.findOne({ norm, page });

      if (!question) {
        return {
          ok: false,
          error: '해당 문항을 찾지 못하였습니다.',
        };
      }

      const imageUrl = selectImageUrl(question.image);
      return {
        ok: true,
        imageUrl,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '문항 가져오기 실패',
      };
    }
  }

  async editQuestion(
    { normId, page }: EditQuestionInput,
    image: string,
  ): Promise<EditQuestionOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });
      if (!norm) {
        deleteImageFile(image);
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }
      const question = await this.question.findOne({ norm, page });
      if (!question) {
        deleteImageFile(image);
        return {
          ok: false,
          error: '존재하지 않는 문항 입니다.',
        };
      }
      deleteImageFile(question.image);
      question.image = image;
      await this.question.save(question);
      return {
        ok: true,
      };
    } catch (error) {
      deleteImageFile(image);
      console.log(error);
      return {
        ok: false,
        error: '문항 변경 실패',
      };
    }
  }

  async deleteQuestion({
    normId,
    page,
  }: DeleteQuestionInput): Promise<DeleteQuestionOutput> {
    try {
      const norm = await this.norm.findOne({ id: normId });
      if (!norm) {
        return {
          ok: false,
          error: '존재하지 않는 규준입니다.',
        };
      }
      const question = await this.question.findOne({ norm, page });
      if (!question) {
        return {
          ok: false,
          error: '존재하지 않는 문항 입니다.',
        };
      }
      await this.question.remove(question);

      const questionList = await this.question.find({
        where: { norm, page: MoreThan(page) },
      });

      for (const editQuestion of questionList) {
        editQuestion.page = editQuestion.page - 1;
        await this.question.save(editQuestion);
      }

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '문항 삭제 실패',
      };
    }
  }
}
