import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/user/entity/user.entity';
import { CreateMarkOutput } from './dto/create-mark.dto';
import { SelectMarkOutput } from './dto/select-mark.dto';
import { UpdateMarkInput, UpdateMarkOutput } from './dto/update-mark.dto';
import { MarkService } from './mark.service';

@ApiTags('MARK')
@Controller('api/mark')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  @ApiOperation({ summary: '마크 생성' })
  @ApiResponse({ type: CreateMarkOutput })
  @Role(['Tester'])
  @Post()
  async createMark(@AuthUser() tester: User): Promise<CreateMarkOutput> {
    return this.markService.createMark(tester);
  }

  @ApiOperation({ summary: '마크 가져오기' })
  @ApiResponse({ type: SelectMarkOutput })
  @Role(['Tester'])
  @Get()
  async selectMark(@AuthUser() tester: User): Promise<SelectMarkOutput> {
    return this.markService.selectMark(tester);
  }

  @ApiOperation({ summary: '마크 업데이트' })
  @ApiResponse({ type: UpdateMarkOutput })
  @Role(['Tester'])
  @Patch('update')
  async updateMark(
    @AuthUser() tester: User,
    @Body() updateMarkInput: UpdateMarkInput,
  ): Promise<CreateMarkOutput> {
    return this.markService.updateMark(tester, updateMarkInput);
  }
}
