export class BggError extends Error {
  readonly status: number;
  readonly details?: string;
  readonly retriable: boolean;

  constructor(
    message: string,
    options: {
      status: number;
      details?: string;
      retriable?: boolean;
    },
  ) {
    super(message);
    this.name = "BggError";
    this.status = options.status;
    this.details = options.details;
    this.retriable = options.retriable ?? false;
  }
}
