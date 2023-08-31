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
  SearchOrientationInput,
  SearchOrientationOutput,
} from './dto/search-orientation.dto';
import {
  SelectOrientationInput,
  SelectOrientationOutput,
} from './dto/select-orientation.dto';
import { OrientationService } from './orientation.service';

@ApiTags('ORIENTATION')
@Controller('api/orientation')
export class OrientationController {
  constructor(private readonly orientationService: OrientationService) {}

  @ApiOperation({ summary: '오리엔테이션 생성' })
  @ApiResponse({ type: CreateOrientationOutput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOption))
  @Role(['SuperAdmin'])
  @Post()
  async createOrientation(
    @Body() createOrientation: CreateOrientationInput,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.orientationService.createOrientation(
      createOrientation,
      file.filename,
    );
  }

  @ApiOperation({ summary: '오리엔테이션 목록' })
  @ApiResponse({ type: SearchOrientationOutput })
  @Role(['Any'])
  @Get('search')
  async searchOrientation(
    @AuthUser() authUser: User,
    @Query() searchOrientationInput: SearchOrientationInput,
  ): Promise<SearchOrientationOutput> {
    return this.orientationService.searchOrientation(
      authUser,
      searchOrientationInput,
    );
  }

  @ApiOperation({ summary: '오리엔터이션 선택' })
  @ApiResponse({ type: SelectOrientationOutput })
  @Get()
  async selectOrientation(
    @Query() selectOrientationInput: SelectOrientationInput,
  ): Promise<SelectOrientationOutput> {
    return this.orientationService.selectOrientation(selectOrientationInput);
  }

  @ApiOperation({ summary: '오리엔터이션 수정' })
  @ApiResponse({ type: EditOrientationOutput })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOption))
  @Patch()
  async editOrientation(
    @Body() editOrientationInput: EditOrientationInput,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<EditOrientationOutput> {
    return this.orientationService.editOrientation(
      editOrientationInput,
      file.filename,
    );
  }

  @ApiOperation({ summary: '오리엔터이션 삭제' })
  @ApiResponse({ type: DeleteOrientationOutput })
  @Delete()
  @Role(['SuperAdmin'])
  async deleteOrientation(
    @Query() deleteOrientationInput: DeleteOrientationInput,
  ): Promise<DeleteOrientationOutput> {
    return this.orientationService.deleteOrientation(deleteOrientationInput);
  }
}
