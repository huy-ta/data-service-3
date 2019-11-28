import LabelSchemaModels from './models';
import CommonSchemaModels from '@schemas/common/models';

const CreateLabelRequestBody = {
  ...LabelSchemaModels.Label,
  description: 'The request body when creating a new label',
  required: [
    'name',
    'color'
  ]
};

delete CreateLabelRequestBody.properties._id;

const UpdateLabelRequestBody = {
  ...CreateLabelRequestBody,
  description: 'The request body when updating an existing label',
};

delete UpdateLabelRequestBody.required;

const SearchLabelRequestBody = {
  description: 'The request body to search for labels',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Major'
    },
    color: {
      type: 'string',
      example: '#ff0000'
    }
  }
};

export default {
  CreateLabelRequestBody,
  UpdateLabelRequestBody,
  SearchLabelRequestBody
};
