import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetInfoRequestDto {
  @IsUUID()
  @IsNotEmpty()
  externalId: string;
}
