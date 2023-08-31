import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { multerOption } from 'src/multer/multer.option';
import { User } from 'src/user/entity/user.entity';
import {
  CreateQuestionInput,
  CreateQuestionOutput,
} from './dto/create-question.dto';
import {
  DeleteQuestionInput,
  DeleteQuestionOutput,
} from './dto/delete-question.dto';
import { EditQuestionInput, EditQuestionOutput } from './dto/edit-question.dto';
import {
  SearchQuestionInput,
  SearchQuestionOutput,
} from './dto/search-question.dto';
import {
  SelectQuestionInput,
  SelectQuestionOutput,
} from './dto/select-question.dto';
import { QuestionService } from './question.service';

@ApiTags('QUESTION')
@Controller('api/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: '문제 생성' })
  @ApiResponse({ type: CreateQuestionOutput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOption))
  @Role(['SuperAdmin'])
  @Post()
  async createQuestion(
    @Body() createQuestion: CreateQuestionInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateQuestionOutput> {
    return this.questionService.createQuestion(createQuestion, file.filename);
  }

  @ApiOperation({ summary: '문제 목록' })
  @ApiResponse({ type: SearchQuestionOutput })
  @Role(['Any'])
  @Get('search')
  async searchQuestion(
    @AuthUser() authUser: User,
    @Query() searchQuestionInput: SearchQuestionInput,
  ): Promise<SearchQuestionOutput> {
    return this.questionService.searchQuestion(authUser, searchQuestionInput);
  }

  @ApiOperation({ summary: '문제 선택' })
  @ApiResponse({ type: SelectQuestionOutput })
  @Role(['Any'])
  @Get()
  async selectQuestion(
    @Query() selectQuestionInput: SelectQuestionInput,
  ): Promise<SelectQuestionOutput> {
    return this.questionService.selectQuestion(selectQuestionInput);
  }

  @ApiOperation({ summary: '문제 수정' })
  @ApiResponse({ type: EditQuestionOutput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOption))
  @Role(['SuperAdmin'])
  @Patch()
  async editQuestion(
    @Body() editQuestionInput: EditQuestionInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<EditQuestionOutput> {
    return this.questionService.editQuestion(editQuestionInput, file.filename);
  }

  @ApiOperation({ summary: '문제 삭제' })
  @ApiResponse({ type: DeleteQuestionOutput })
  @Role(['SuperAdmin'])
  @Delete()
  async deleteQuestion(
    @Query() deleteQuestionInput: DeleteQuestionInput,
  ): Promise<DeleteQuestionOutput> {
    return this.questionService.deleteQuestion(deleteQuestionInput);
  }
}
