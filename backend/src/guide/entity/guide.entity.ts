import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CoreEntity } from 'src/common/entity/core.entity';
import { deleteImageFile } from 'src/multer/multer.option';
import { Norm } from 'src/norm/entity/norm.entity';
import { BeforeRemove, Column, Entity, ManyToOne, RelationId } from 'typeorm';

// norm + page 고유값 설정법 확인 필요
@Entity()
export class Guide extends CoreEntity {
  @ManyToOne(() => Norm, { onDelete: 'CASCADE' })
  norm: Norm;

  @ApiProperty({ description: '규준 id' })
  @RelationId((guide: Guide) => guide.norm)
  normId: number;

  @ApiProperty({ description: '규준 페이지 번호' })
  @Column()
  page: number;

  @ApiProperty({ description: '규준 이미지' })
  @Column()
  image: string;

  @BeforeRemove()
  async deleteImage(): Promise<void> {
    try {
      console.log(this.image);

      deleteImageFile(this.image);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
