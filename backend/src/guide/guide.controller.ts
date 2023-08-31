import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreateGuideInput, CreateGuideOutput } from './dto/create-guide.dto';
import { DeleteGuideInput, DeleteGuideOutput } from './dto/delete-guide.dto';
import { EditGuideInput, EditGuideOutput } from './dto/edit-guide.dto';
import {
  FindGuideRelatedToNormInput,
  FindGuideRelatedToNormOutput,
} from './dto/find-guide-related-to-norm.dto';
import { SearchGuideInput, SearchGuideOutput } from './dto/search-guide.dto';
import { SelectGuideInput, SelectGuideOutput } from './dto/select-guide.dto';
import { GuideService } from './guide.service';

@ApiTags('GUIDE')
@Controller('api/guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @ApiOperation({ summary: '가이드 생성' })
  @ApiResponse({ type: CreateGuideOutput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOption))
  @Role(['SuperAdmin'])
  @Post()
  async createGuide(
    @Body() createGuideInput: CreateGuideInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateGuideOutput> {
    return this.guideService.createGuide(createGuideInput, file.filename);
  }

  @ApiOperation({ summary: '가이드 목록' })
  @ApiResponse({ type: SearchGuideOutput })
  @Role(['SuperAdmin'])
  @Get('search')
  async searchGuide(
    @Query() searchGuideInput: SearchGuideInput,
  ): Promise<SearchGuideOutput> {
    return this.guideService.searchGuide(searchGuideInput);
  }

  @ApiOperation({ summary: '가이드 선택' })
  @ApiResponse({ type: SelectGuideOutput })
  @Role(['SuperAdmin_Admin'])
  @Get()
  async selectGuide(
    @Query() selectGuideInput: SelectGuideInput,
  ): Promise<SelectGuideOutput> {
    return this.guideService.selectGuide(selectGuideInput);
  }

  @ApiOperation({ summary: '규준과 관련된 가이드 정보 가져오기' })
  @ApiResponse({ type: FindGuideRelatedToNormOutput })
  @Role(['SuperAdmin_Admin'])
  @Get(':normId')
  async findGuideListRelatedToNorm(
    @AuthUser() authUser: User,
    @Param() { normId }: FindGuideRelatedToNormInput,
  ): Promise<FindGuideRelatedToNormOutput> {
    return this.guideService.findGuideListRelatedToNorm(authUser, normId);
  }

  @ApiOperation({ summary: '가이드 수정' })
  @ApiResponse({ type: EditGuideOutput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOption))
  @Role(['SuperAdmin'])
  @Patch()
  async editGuide(
    @Body() editGuideInput: EditGuideInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<EditGuideOutput> {
    return this.guideService.editGuide(editGuideInput, file.filename);
  }

  @ApiOperation({ summary: '가이드 삭제' })
  @ApiResponse({ type: DeleteGuideOutput })
  @Role(['SuperAdmin'])
  @Delete()
  async deleteGuide(
    @Query() deleteGuideInput: DeleteGuideInput,
  ): Promise<DeleteGuideOutput> {
    return this.guideService.deleteGuide(deleteGuideInput);
  }
}
