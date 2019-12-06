enum TAGS {
  HELLO = 'hello',
  USERS = 'users',
  SYNC_STATES = 'sync states',
  DEPARTMENTS = 'departments'
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
  },
  {
    name: TAGS.DEPARTMENTS,
    description: 'Operations on departments'
  }
];

export { TAGS, tags };

export default tags;
