import {
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * Base Custom Exception
 */
export class CustomException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: string,
  ) {
    super(
      {
        statusCode,
        message,
        error: error || 'Error',
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

/**
 * Business Logic Exception
 */
export class BusinessException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST, 'Business Error');
  }
}

/**
 * Validation Exception
 */
export class ValidationException extends CustomException {
  constructor(message: string | string[]) {
    const errorMessage = Array.isArray(message) ? message.join(', ') : message;
    super(errorMessage, HttpStatus.BAD_REQUEST, 'Validation Error');
  }
}

/**
 * Resource Not Found Exception
 */
export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier ${identifier} not found`
      : `${resource} not found`;
    super(message);
  }
}

/**
 * Resource Already Exists Exception
 */
export class ResourceAlreadyExistsException extends ConflictException {
  constructor(resource: string, field?: string, value?: string) {
    const message =
      field && value
        ? `${resource} with ${field} '${value}' already exists`
        : `${resource} already exists`;
    super(message);
  }
}

/**
 * Unauthorized Access Exception
 */
export class UnauthorizedAccessException extends UnauthorizedException {
  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}

/**
 * Forbidden Access Exception
 */
export class ForbiddenAccessException extends ForbiddenException {
  constructor(message: string = 'Forbidden access') {
    super(message);
  }
}

/**
 * Invalid Credentials Exception
 */
export class InvalidCredentialsException extends UnauthorizedException {
  constructor(message: string = 'Invalid credentials') {
    super(message);
  }
}

/**
 * Token Expired Exception
 */
export class TokenExpiredException extends UnauthorizedException {
  constructor(message: string = 'Token has expired') {
    super(message);
  }
}

/**
 * Invalid Token Exception
 */
export class InvalidTokenException extends UnauthorizedException {
  constructor(message: string = 'Invalid token') {
    super(message);
  }
}

/**
 * Database Exception
 */
export class DatabaseException extends InternalServerErrorException {
  constructor(message: string = 'Database error occurred') {
    super(message);
  }
}

/**
 * File Upload Exception
 */
export class FileUploadException extends BadRequestException {
  constructor(message: string = 'File upload failed') {
    super(message);
  }
}

/**
 * External Service Exception
 */
export class ExternalServiceException extends CustomException {
  constructor(service: string, message?: string) {
    const errorMessage = message
      ? `${service} error: ${message}`
      : `${service} is unavailable`;
    super(
      errorMessage,
      HttpStatus.SERVICE_UNAVAILABLE,
      'External Service Error',
    );
  }
}

/**
 * Rate Limit Exception
 */
export class RateLimitException extends CustomException {
  constructor(message: string = 'Too many requests') {
    super(message, HttpStatus.TOO_MANY_REQUESTS, 'Rate Limit Error');
  }
}

/**
 * Payment Required Exception
 */
export class PaymentRequiredException extends CustomException {
  constructor(message: string = 'Payment required') {
    super(message, HttpStatus.PAYMENT_REQUIRED, 'Payment Required');
  }
}
