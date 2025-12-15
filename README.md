<!-- exception -->

```
// 1. Resource not found
throw new ResourceNotFoundException('User', userId);

// 2. Resource already exists
throw new ResourceAlreadyExistsException('User', 'email', email);

// 3. Business logic error
throw new BusinessException('Cannot delete admin users');

// 4. Validation error
throw new ValidationException('Invalid email format');
throw new ValidationException(['Email is required', 'Password too short']);

// 5. Authentication errors
throw new InvalidCredentialsException('Invalid email or password');
throw new UnauthorizedAccessException('Token is missing');
throw new TokenExpiredException('Your session has expired');
throw new InvalidTokenException('Malformed token');

// 6. Authorization error
throw new ForbiddenAccessException('Admin access required');

// 7. External service error
throw new ExternalServiceException('Payment Gateway', 'Connection timeout');

// 8. Rate limiting
throw new RateLimitException('Too many requests, please try again later');

// 9. Payment required
throw new PaymentRequiredException('Subscription required');

// 10. Database error
throw new DatabaseException('Failed to connect to database');

// 11. File upload error
throw new FileUploadException('File size exceeds limit');
```
