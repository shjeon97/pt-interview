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
import { Role } from 'src/auth/role.decorator';
import { AllNormOutput } from './dto/all-norm.dto';
import { CreateNormInput, CreateNormOutput } from './dto/create-norm.dto';
import { DeleteNormInput, DeleteNormOutput } from './dto/delete-norm.dto';
import { EditNormInput, EditNormOutput } from './dto/edit-norm.dto';
import { SearchNormInput, SearchNormOutput } from './dto/search-norm.dto';
import { SelectNormInput, SelectNormOutput } from './dto/select-norm.dto';
import { NormService } from './norm.service';

@ApiTags('NORM')
@Controller('api/norm')
export class NormController {
  constructor(private readonly normService: NormService) {}

  @ApiOperation({ summary: '모든 규준 선택' })
  @ApiResponse({ type: AllNormOutput })
  @Role(['SuperAdmin'])
  @Get('all')
  async allNorm(): Promise<AllNormOutput> {
    return this.normService.allNorm();
  }

  @ApiOperation({ summary: '규준 목록' })
  @ApiResponse({ type: SearchNormOutput })
  @Role(['SuperAdmin'])
  @Get('search')
  async searchNorm(
    @Query() searchNormInput: SearchNormInput,
  ): Promise<SearchNormOutput> {
    return this.normService.searchNorm(searchNormInput);
  }

  @ApiOperation({ summary: '규준정보 엑셀 다운로드' })
  @Role(['SuperAdmin'])
  @Get('download')
  async downloadNorm(@Res() res) {
    return this.normService.downloadNorm(res);
  }

  @ApiOperation({ summary: '규준 생성' })
  @ApiResponse({ type: CreateNormOutput })
  @Role(['SuperAdmin'])
  @Post()
  async createNorm(
    @Body() createNormInput: CreateNormInput,
  ): Promise<CreateNormOutput> {
    return this.normService.createNorm(createNormInput);
  }

  @ApiOperation({ summary: '규준 선택' })
  @ApiResponse({ type: SelectNormOutput })
  @Get(':id')
  async selectNorm(
    @Param() selectNormInput: SelectNormInput,
  ): Promise<SelectNormOutput> {
    return this.normService.selectNorm(selectNormInput);
  }

  @ApiOperation({ summary: '규준 수정' })
  @ApiResponse({ type: EditNormOutput })
  @Role(['SuperAdmin'])
  @Patch()
  async editNorm(
    @Body() editNormInput: EditNormInput,
  ): Promise<EditNormOutput> {
    return this.normService.editNorm(editNormInput);
  }

  @ApiOperation({ summary: '규준 삭제' })
  @ApiResponse({ type: DeleteNormOutput })
  @Delete(':id')
  @Role(['SuperAdmin'])
  async deleteNorm(
    @Param() deleteNormInput: DeleteNormInput,
  ): Promise<DeleteNormOutput> {
    return this.normService.deleteNorm(deleteNormInput);
  }
}
