import type { ApiErrorCode } from '@ww/shared';

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: unknown;

  constructor(code: ApiErrorCode, message: string, status = 400, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  static unauthorized(message = 'برای این کار باید وارد شوید.') {
    return new ApiError('unauthorized', message, 401);
  }
  static forbidden(message = 'اجازه دسترسی به این بخش را ندارید.') {
    return new ApiError('forbidden', message, 403);
  }
  static notFound(message = 'موردی یافت نشد.') {
    return new ApiError('not_found', message, 404);
  }
  static validation(message: string, details?: unknown) {
    return new ApiError('validation_error', message, 422, details);
  }
  static conflict(message: string, details?: unknown) {
    return new ApiError('conflict', message, 409, details);
  }
  static insufficientFunds(message = 'موجودی خزانه کافی نیست.', details?: unknown) {
    return new ApiError('insufficient_funds', message, 409, details);
  }
  static rateLimited(message: string, retryAfterSeconds = 60) {
    return new ApiError('rate_limited', message, 429, { retryAfterSeconds });
  }
  static disabled(feature: string) {
    return new ApiError('feature_disabled', `بخش «${feature}» موقتاً غیرفعال است.`, 403);
  }
  static quota(message = 'سهمیه پردازشی سرویس رایگان به حد خود رسیده است.') {
    return new ApiError('quota_exceeded', message, 503);
  }
  static internal(message = 'خطای داخلی سرور.', details?: unknown) {
    return new ApiError('internal_error', message, 500, details);
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

export function toApiError(e: unknown): ApiError {
  if (isApiError(e)) return e;
  const msg = e instanceof Error ? e.message : String(e);
  const lower = msg.toLowerCase();
  // translate constraint violations into stable API errors
  if (lower.includes('unique') || lower.includes('conflict')) return ApiError.conflict(msg);
  if (lower.includes('check constraint')) return ApiError.validation('مقدار وارد شده نامعتبر است.');
  if (lower.includes('foreign key')) return ApiError.validation('رابطه داده نامعتبر است.');
  if (lower.includes('append-only')) return ApiError.forbidden('ثبت‌های مالی قابل تغییر یا حذف نیستند.');
  return ApiError.internal('خطای غیرمنتظره.', msg);
}
