const PaginationQueryParams = {
  type: 'object',
  properties: {
    offset: {
      type: 'integer',
      minimum: 0,
      default: 0
    },
    limit: {
      type: 'integer',
      minimum: 0,
      default: 40
    }
  }
};

export default {
  PaginationQueryParams
};
