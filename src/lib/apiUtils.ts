// lib/apiUtils.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * Типы ошибок API
 */
export enum ApiErrorType {
  VALIDATION_ERROR = 'validation_error',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  CONFLICT = 'conflict',
  INTERNAL_ERROR = 'internal_error',
  BAD_REQUEST = 'bad_request',
  TOO_MANY_REQUESTS = 'too_many_requests'
}

/**
 * Базовая структура ошибки API
 */
export interface ApiError {
  type: ApiErrorType;
  message: string;
  details?: any;
  code?: string;
}

/**
 * Создает стандартный ответ с ошибкой API
 * 
 * @param error Объект ошибки
 * @param status HTTP статус ответа
 * @returns NextResponse с форматированной ошибкой
 */
export function createErrorResponse(error: ApiError, status: number): NextResponse {
  return NextResponse.json({ error }, { status });
}

/**
 * Создает стандартный успешный ответ API
 * 
 * @param data Данные для ответа
 * @param status HTTP статус ответа (по умолчанию 200)
 * @returns NextResponse с данными
 */
export function createSuccessResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Проверяет наличие обязательных полей в теле запроса
 * 
 * @param body Тело запроса для проверки
 * @param requiredFields Массив обязательных полей
 * @returns null, если все поля присутствуют, или объект ошибки
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): ApiError | null {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    return {
      type: ApiErrorType.VALIDATION_ERROR,
      message: 'Отсутствуют обязательные поля',
      details: { missingFields }
    };
  }
  
  return null;
}

/**
 * Обертка для обработчика API с обработкой ошибок
 * 
 * @param handler Функция обработчик API
 * @returns Обработанная функция с поддержкой ошибок
 */
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error('API ошибка:', error);
      
      // Обрабатываем известные типы ошибок
      if (error.type && Object.values(ApiErrorType).includes(error.type)) {
        const status = getStatusCodeForErrorType(error.type);
        return createErrorResponse(error, status);
      }
      
      // Общая ошибка сервера для необработанных исключений
      return createErrorResponse(
        {
          type: ApiErrorType.INTERNAL_ERROR,
          message: 'Произошла внутренняя ошибка сервера',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        500
      );
    }
  };
}

/**
 * Возвращает HTTP статус для типа ошибки
 * 
 * @param errorType Тип ошибки API
 * @returns Соответствующий HTTP статус-код
 */
function getStatusCodeForErrorType(errorType: ApiErrorType): number {
  switch (errorType) {
    case ApiErrorType.VALIDATION_ERROR:
    case ApiErrorType.BAD_REQUEST:
      return 400;
    case ApiErrorType.UNAUTHORIZED:
      return 401;
    case ApiErrorType.FORBIDDEN:
      return 403;
    case ApiErrorType.NOT_FOUND:
      return 404;
    case ApiErrorType.CONFLICT:
      return 409;
    case ApiErrorType.TOO_MANY_REQUESTS:
      return 429;
    case ApiErrorType.INTERNAL_ERROR:
    default:
      return 500;
  }
}