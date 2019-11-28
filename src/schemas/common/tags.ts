enum TAGS {
  HELLO = 'hello',
  USERS = 'users',
  SYNC_STATES = 'sync states'
}

const tags = [
  {
    name: TAGS.HELLO,
    description: 'Ways to say hello to the world'
  },
  {
    name: TAGS.SYNC_STATES,
    description: 'Data synchronization states'
  },
  {
    name: TAGS.USERS,
    description: 'Operations on users'
  }
];

export { TAGS, tags };

export default tags;
