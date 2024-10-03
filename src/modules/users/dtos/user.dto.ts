import { ProfilePicture } from '@config/dbs/profile-picture.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserProfilePicDto implements ProfilePicture {
  @ApiPropertyOptional()
  @IsOptional()
  fileId: string;

  @ApiPropertyOptional()
  @IsOptional()
  filePath: string;

  @ApiPropertyOptional()
  @IsOptional()
  fileSize: number;

  @ApiPropertyOptional()
  @IsOptional()
  fileUniqueId: string;

  @ApiPropertyOptional()
  @IsOptional()
  height: number;

  @ApiPropertyOptional()
  @IsOptional()
  width: number;
}

export class CreateUserDto {
  @ApiProperty({ default: '123' })
  @IsNotEmpty()
  chatId?: string;

  @ApiProperty({ default: '123' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ default: 'bedulkoflok' })
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  profilePics?: string;
}
