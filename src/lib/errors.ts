import type { FeatureError } from '../types/hardware'

const permissionErrorNames = new Set([
  'NotAllowedError',
  'PermissionDeniedError',
  'SecurityError',
])

export const toFeatureError = (error: unknown): FeatureError => {
  if (error instanceof DOMException) {
    if (permissionErrorNames.has(error.name)) {
      return {
        code: 'permission_denied',
        message: 'Permission denied. Please allow access and try again.',
      }
    }

    if (error.name === 'NotFoundError') {
      return {
        code: 'device_not_found',
        message: 'No compatible hardware device was found.',
      }
    }

    return {
      code: error.name,
      message: error.message,
    }
  }

  if (error instanceof Error) {
    return {
      code: 'unexpected_error',
      message: error.message,
    }
  }

  return {
    code: 'unexpected_error',
    message: 'Unexpected error. Please try again.',
  }
}
