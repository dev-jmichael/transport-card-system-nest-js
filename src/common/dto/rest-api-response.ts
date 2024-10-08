export class RestApiResponse<T> {
  constructor(
    public success: boolean,
    public data: T,
  ) {}
}
