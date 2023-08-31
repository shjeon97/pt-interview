import { ApiProperty, PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Guide } from 'src/guide/entity/guide.entity';

export class FindGuideRelatedToNormInput {
  @ApiProperty({ description: '전체 가이드 수' })
  normId: number;
}

export class DetailGuide extends PickType(Guide, ['page']) {
  @ApiProperty({ description: '이미지 url' })
  imageUrl: string;
}

export class FindGuideRelatedToNormOutput extends CoreOutput {
  @ApiProperty({ description: '규준과 관련된 가이드 리스트' })
  guideList?: DetailGuide[];

  @ApiProperty({ description: '전체 가이드 수' })
  totalPage?: number;
}
