import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseInterceptor } from '@utils/interceptors';
import { UploaderService } from '../service/uploader.service';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/uploader.dto';

@ApiTags('Uploader')
@ApiBearerAuth()
@Controller({ path: 'uploaders', version: '1' })
export class UploaderController {
  constructor(private readonly service: UploaderService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadDto,
  })
  @UseInterceptors(new ResponseInterceptor('uploader'), FileInterceptor('file'))
  async fileUpload(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadFile(file);
  }
}
