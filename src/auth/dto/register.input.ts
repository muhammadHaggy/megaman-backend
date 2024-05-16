import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterInput {
  @ApiProperty({
    minLength: 8,
  })
  @IsString()
  username: string;

  @ApiProperty({
    maxLength: 65,
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(65)
  password: string;

  @ApiProperty({
    example: 'root@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;
}
