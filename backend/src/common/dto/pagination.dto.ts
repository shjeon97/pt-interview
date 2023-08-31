import { ApiProperty } from '@nestjs/swagger';
import { CoreOutput } from './output.dto';

export class PaginationInput {
  @ApiProperty({ description: '페이지 번호' })
  page: number;
  @ApiProperty({ description: '표시할 리스트 수' })
  pagesize: number;
  @ApiProperty({ description: '검색 타입' })
  searchType?: string;
  @ApiProperty({ description: '검색값' })
  searchValue?: string;
}

export class PaginationOutput extends CoreOutput {
  @ApiProperty({ description: '전체 페이지 수' })
  totalPage?: number;
  @ApiProperty({ description: '전체 리스트 수' })
  totalResult?: number;
  @ApiProperty({ description: '검색 타입' })
  searchType?: string;
  @ApiProperty({ description: '검색값' })
  searchValue?: string;
}
