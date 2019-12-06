const CONFIG = {
  SEARCH_DEFAULT: {
    OFFSET: 0,
    LIMIT: 40
  },
  API_URL: {
    USERS: {
      GET_ALL: 'https://dsd05-dot-my-test-project-252009.appspot.com/user/getUserInfos',
      GET_ONE: 'https://dsd05-dot-my-test-project-252009.appspot.com/user/getUserInfo?id='
    },
    DEPARTMENTS: {
      GET_ALL: 'http://18.217.21.235:8083/api/v1/organizationalStructure/listOrganization',
      GET_ONE: 'http://18.217.21.235:8083/api/v1/organizationalStructure/detailOrganization?organizationId='
    }
  }
};

export default CONFIG;
