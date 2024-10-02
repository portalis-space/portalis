import { ApiProperty } from '@nestjs/swagger';
import { BaseViewmodel } from '@utils/base-class/base.viewmodel';
import { MetaEncryptorService } from '@utils/helpers/meta-encryptor/meta-encryptor.service';
import { Expose, Transform, Type } from 'class-transformer';
import { CreateUserDto, CreateUserProfilePicDto } from '../dtos/user.dto';

export class ProfilePictureVms implements CreateUserProfilePicDto {
  @Expose()
  fileId: string;
  @Expose()
  @Transform(
    ({ value }) =>
      `${process.env.TELE_API_URL}${process.env.TELE_BOT}/${value}`,
  )
  filePath: string;
  @Expose()
  fileSize: number;
  @Expose()
  fileUniqueId: string;
  @Expose()
  height: number;
  @Expose()
  width: number;
}
export class UserVms implements CreateUserDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const enc = new MetaEncryptorService();
    return enc.encrypt(obj._id);
  })
  id: string;
  @Expose()
  chatId: string;
  @Expose()
  username: string;
  @Expose()
  userId: string;
  @Expose()
  @Type(() => ProfilePictureVms)
  profilePics: ProfilePictureVms[];
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
}
