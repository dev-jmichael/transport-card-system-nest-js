import { ApiProperty } from '@nestjs/swagger';

export class RestApiResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T;

  constructor(success: boolean, data: T) {
    this.success = success;
    this.data = data;
  }
}
