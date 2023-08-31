import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { DeleteUserInput, DeleteUserOutput } from './dto/delete-user.dto';
import { EditTesterInput, EditTesterOutput } from './dto/edit-tester.dto.';
import { EditUserInput, EditUserOutput } from './dto/edit-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { SearchUserInput, SearchUserOutput } from './dto/search-user.dto';
import { SelectUserInput, SelectUserOutput } from './dto/select-user.dto';
import {
  UploadUserListInput,
  UploadUserListOutput,
} from './dto/upload-user-list.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@ApiTags('USER')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({ type: CreateUserOutput })
  @Role(['SuperAdmin'])
  @Post()
  async createUser(
    @Body() createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @ApiOperation({ summary: '유저 리스트 업로드' })
  @ApiResponse({ type: UploadUserListOutput })
  @Role(['SuperAdmin'])
  @Post('upload')
  async uploadUserList(
    @Body() uploadUserListInput: UploadUserListInput,
  ): Promise<UploadUserListOutput> {
    return this.userService.uploadUserList(uploadUserListInput);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ type: LoginOutput })
  @Post('login')
  async login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Any'])
  @Delete('logout')
  async logout(@AuthUser() authUser: User): Promise<CoreOutput> {
    return this.userService.logout(authUser);
  }

  @ApiOperation({ summary: '내 정보' })
  @ApiResponse({ type: User })
  @Role(['Any'])
  @Get('me')
  async me(@AuthUser() authUser: User) {
    return authUser;
  }

  @ApiOperation({ summary: '유저 목록' })
  @ApiResponse({ type: SearchUserOutput })
  @Role(['SuperAdmin'])
  @Get('search')
  async searchUser(
    @Query() searchUserInput: SearchUserInput,
  ): Promise<SearchUserOutput> {
    return this.userService.searchUser(searchUserInput);
  }

  @ApiOperation({ summary: '검사 시작' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Tester'])
  @Patch('start-test')
  async startTest(@AuthUser() authUser: User): Promise<CoreOutput> {
    return this.userService.startTest(authUser);
  }

  @ApiOperation({ summary: '검사 종료' })
  @ApiResponse({ type: CoreOutput })
  @Role(['Tester'])
  @Patch('end-test')
  async endTest(@AuthUser() tester: User): Promise<CoreOutput> {
    return this.userService.endTest(tester);
  }

  @ApiOperation({ summary: '유저 선택' })
  @ApiResponse({ type: SelectUserOutput })
  @Role(['SuperAdmin'])
  @Get(':id')
  async selectUser(
    @AuthUser() authUser: User,
    @Param() selectUserInput: SelectUserInput,
  ): Promise<SelectUserOutput> {
    return this.userService.selectUser(authUser, selectUserInput);
  }

  @ApiOperation({ summary: '지원자 정보 수정' })
  @ApiResponse({ type: EditTesterOutput })
  @Role(['SuperAdmin'])
  @Patch('edit-tester')
  async editTester(@Body() editTesterInput: EditTesterInput) {
    return this.userService.editTester(editTesterInput);
  }

  @ApiOperation({ summary: '유저 수정' })
  @ApiResponse({ type: EditUserOutput })
  @Role(['SuperAdmin'])
  @Patch()
  async editUser(
    @Body() editUserInput: EditUserInput,
  ): Promise<EditUserOutput> {
    return this.userService.editUser(editUserInput);
  }

  @ApiOperation({ summary: '유저 삭제' })
  @ApiResponse({ type: DeleteUserOutput })
  @Role(['SuperAdmin'])
  @Delete(':userId')
  async deleteUser(
    @Param() deleteUserInput: DeleteUserInput,
  ): Promise<DeleteUserOutput> {
    return this.userService.deleteUser(deleteUserInput);
  }
}
