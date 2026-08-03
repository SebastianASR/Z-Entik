import { IsString, Matches } from 'class-validator';

export class VerifyTwoFactorLoginDto {
  @IsString()
  twoFactorToken: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code: string;
}
