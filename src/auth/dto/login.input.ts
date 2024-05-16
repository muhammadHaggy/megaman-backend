import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginInput {
  @ApiProperty({
    minLength: 6,
    example: 'user1@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    maxLength: 65,
    example: 'password1',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(65)
  password: string;
}
