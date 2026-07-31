import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  // Opcional pois a fonte primaria agora e o cookie httpOnly
  // (refresh_token) - o corpo fica como fallback para chamadas
  // server-to-server/scripts.
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  refresh_token?: string;
}
