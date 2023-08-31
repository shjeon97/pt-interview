import { ApiProperty } from '@nestjs/swagger';

export class DownloadTemplateInput {
  @ApiProperty({ description: '템플릿 파일명' })
  name: string;
}
