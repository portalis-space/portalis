import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ResponseInterceptor } from '@utils/interceptors';
import { FileUploadDto } from '../dto/uploader.dto';
import { UploaderService } from '../service/uploader.service';
import { Public } from 'modules/common/decorators';
import { AdmGuard } from 'modules/common/guards/adm.guard';

@ApiTags('Uploader - Admin')
@ApiBearerAuth('Admin')
@Public()
@UseGuards(AdmGuard)
@Controller({ path: 'admin/uploaders', version: '1' })
export class UploaderAdminController {
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
