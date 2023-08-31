import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { Role } from 'src/auth/role.decorator';
import { DownloadTemplateInput } from './dto/download-template.dto';

@ApiTags('COMMON')
@Controller('api/download')
export class CommonController {
  @ApiOperation({ summary: '템플릿 다운로드' })
  @ApiResponse({ type: StreamableFile })
  @Get('template')
  @Role(['SuperAdmin'])
  getFile(@Query() { name: filename }: DownloadTemplateInput): StreamableFile {
    try {
      const downloadPath = join(process.cwd(), `/public/template/${filename}`);
      if (!existsSync(downloadPath)) {
        throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
      }

      const file = createReadStream(downloadPath);

      return new StreamableFile(file);
    } catch (error) {
      console.log(error);
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
