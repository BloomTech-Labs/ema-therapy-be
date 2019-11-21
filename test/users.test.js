const { graphql, GraphQLObjectType, GraphQLSchema } = require('graphql');
const User = require('../models/user');
const { UsersField } = require('../schema/users');

describe('users query', () => {
  it('returns appropriate user data', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          users: UsersField,
        },
      }),
    });
    const query = `{
            users {
                id
                email
                sub
                firstName
                lastName
                createdAt
            }
        }`;
    const mockUser1 = {
      id: '8675309',
      email: 'test@help.com',
      sub: 'fakeSub',
      firstName: 'testy',
      lastName: 'mctestface',
      createdAt: `${Date.now()}`,
    };
    const mockUser2 = {
      id: 'pain',
      email: 'graphql@sucks.com',
      sub: 'shouldHaveBeenAnOptometrist',
      firstName: 'why',
      lastName: 'noooooooo',
      createdAt: `${Date.now()}`,
    };

    jest
      .spyOn(User, 'find')
      .mockReturnValue(Promise.resolve([mockUser1, mockUser2]));

    return graphql(schema, query, {}, {}).then((result) => {
      expect(result).not.toBe(null);
      expect(result.data).toEqual({
        users: [mockUser1, mockUser2],
      });
    });
  });
});
