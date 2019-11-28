const NotModified304Response = {
  description: 'The response body when the resource that was previously requested to update was not modified',
  type: 'object',
  properties: {
    statusCode: {
      type: 'integer',
      enum: [
        304
      ]
    },
    message: {
      type: 'string',
      example: 'The requested resource was not modified'
    }
  }
};

const BadRequest400Response = {
  description: 'The response body when the request is invalid',
  type: 'object',
  properties: {
    statusCode: {
      type: 'integer',
      enum: [
        400
      ]
    },
    error: {
      type: 'string',
      example: 'Bad Request'
    },
    message: {
      type: 'string',
      example: 'body should have required property \'xxx\''
    }
  }
};

const Unauthorized401Response = {
  description: 'The response body when the requesting agent is not authorized',
  type: 'object',
  properties: {
    statusCode: {
      type: 'integer',
      enum: [
        401
      ]
    },
    error: {
      type: 'string',
      example: 'Unauthorized'
    },
    message: {
      type: 'string',
      example: 'You are not authorized to perform the action'
    }
  }
};

const ForbiddenAccess403Response = {
  description: 'The response body when the requesting agent does not have sufficient permission',
  type: 'object',
  properties: {
    statusCode: {
      type: 'integer',
      enum: [
        403
      ]
    },
    error: {
      type: 'string',
      example: 'Forbidden'
    },
    message: {
      type: 'string',
      example: 'You do not have sufficient permission'
    }
  }
};

const ResourceNotFound404Response = {
  description: 'The response body when a requested resource is not found',
  type: 'object',
  properties: {
    statusCode: {
      type: 'integer',
      enum: [
        404
      ]
    },
    error: {
      type: 'string',
      example: 'Not Found'
    },
    message: {
      type: 'string',
      example: 'Resource with the requested ID was not found'
    }
  }
};

const ServerError5XXResponse = {
  description: 'The response body when an unexpected error occurs in the server',
  type: 'object',
  properties: {
    statusCode: {
      type: 'integer',
      enum: [
        500,
        501,
        502,
        503
      ]
    },
    error: {
      type: 'string',
      example: 'Internal Server Error'
    },
    message: {
      type: 'string',
      example: 'An unexpected error happened on our side'
    }
  }
};

export default {
  NotModified304Response,
  BadRequest400Response,
  Unauthorized401Response,
  ForbiddenAccess403Response,
  ResourceNotFound404Response,
  ServerError5XXResponse
};
