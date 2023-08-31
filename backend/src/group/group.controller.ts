import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/user/entity/user.entity';
import { SearchGroupInput, SearchGroupOutput } from './dto/search-group.dto';
import { CreateGroupInput, CreateGroupOutput } from './dto/create-group.dto';
import { DeleteGroupInput, DeleteGroupOutput } from './dto/delete-group.dto';
import { DetailGroupInput, DetailGroupOutput } from './dto/detail-group.dto';
import { EditGroupInput, EditGroupOutput } from './dto/edit-group.dto';
import { SelectGroupInput, SelectGroupOutput } from './dto/select-group.dto';
import { GroupService } from './group.service';
import { AllGroupOutput } from './dto/all-group.dto';
import {
  UploadGroupListInput,
  UploadGroupListOutput,
} from './dto/upload-group-list.dto';

@ApiTags('GROUP')
@Controller('api/group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '공고 생성' })
  @ApiResponse({ type: CreateGroupOutput })
  @Role(['SuperAdmin'])
  @Post()
  async createGroup(
    @Body() createGroupInput: CreateGroupInput,
  ): Promise<CreateGroupOutput> {
    return this.groupService.createGroup(createGroupInput);
  }

  @ApiOperation({ summary: '공고 수정' })
  @ApiResponse({ type: EditGroupOutput })
  @Role(['SuperAdmin'])
  @Patch()
  async editGroup(
    @Body() editGroupInput: EditGroupInput,
  ): Promise<EditGroupOutput> {
    return this.groupService.editGroup(editGroupInput);
  }
  @ApiOperation({ summary: '모든 공고 선택' })
  @ApiResponse({ type: AllGroupOutput })
  @Role(['SuperAdmin'])
  @Get('all')
  async allGroup(): Promise<AllGroupOutput> {
    return this.groupService.allGroup();
  }

  @ApiOperation({ summary: '공고 리스트 업로드' })
  @ApiResponse({ type: UploadGroupListOutput })
  @Role(['SuperAdmin'])
  @Post('upload')
  async uploadGroupList(
    @Body() uploadGroupListInput: UploadGroupListInput,
  ): Promise<UploadGroupListOutput> {
    return this.groupService.uploadGroupList(uploadGroupListInput);
  }

  @ApiOperation({ summary: '공고정보 엑셀 다운로드' })
  @Role(['SuperAdmin'])
  @Get('download')
  async downloadGroup(@Res() res) {
    return this.groupService.downloadGroup(res);
  }

  @ApiOperation({ summary: '공고 목록' })
  @ApiResponse({ type: SearchGroupOutput })
  @Role(['SuperAdmin_Admin'])
  @Get('search')
  async searchGroup(
    @AuthUser() authUser: User,
    @Query() searchGroupInput: SearchGroupInput,
  ): Promise<SearchGroupOutput> {
    return this.groupService.searchGroup(authUser, searchGroupInput);
  }

  @ApiOperation({ summary: '공고 선택' })
  @ApiResponse({ type: SelectGroupOutput })
  @Role(['SuperAdmin_Admin'])
  @Get(':id')
  async selectGroup(
    @AuthUser() authUser: User,
    @Param() selectGroupInput: SelectGroupInput,
  ): Promise<SelectGroupOutput> {
    return this.groupService.selectGroup(authUser, selectGroupInput);
  }

  @ApiOperation({ summary: '공고 삭제' })
  @ApiResponse({ type: DeleteGroupOutput })
  @Role(['SuperAdmin'])
  @Delete(':id')
  async deleteGroup(
    @AuthUser() authUser: User,
    @Param() deleteGroupInput: DeleteGroupInput,
  ): Promise<DeleteGroupOutput> {
    return this.groupService.deleteGroup(deleteGroupInput);
  }

  @ApiOperation({ summary: '공고정보' })
  @ApiResponse({ type: DetailGroupOutput })
  @Role(['SuperAdmin_Admin'])
  @Get('detail/:groupId')
  async detailGroup(
    @AuthUser() authUser: User,
    @Param() detailGroupInput: DetailGroupInput,
  ): Promise<DetailGroupOutput> {
    return this.groupService.detailGroup(authUser, detailGroupInput);
  }
}
