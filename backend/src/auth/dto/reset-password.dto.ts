import { IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(32)
  token: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'La nueva contrasena debe incluir al menos una mayuscula, una minuscula y un numero',
  })
  newPassword: string;

  @IsString()
  @MinLength(8)
  confirmPassword: string;
}
