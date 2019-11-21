const { graphql, GraphQLObjectType, GraphQLSchema } = require('graphql');
const User = require('../models/user');
const { UsersField, UserField } = require('../schema/users');
const { when } = require('jest-when');

describe('multiple users query', () => {
  it('returns appropriate array of users with user data', () => {
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

describe('single user query', () => {
  it('returns appropriate user when count is 1 and sub is provided', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'Query',
        fields: {
          user: UserField,
        },
      }),
    });

    const mockUser1 = {
      id: '867530900',
      email: 'test2@help.com',
      sub: 'fakeSub2',
      firstName: 'testy2',
      lastName: 'mctestface2',
      createdAt: `${Date.now()}`,
    };

    const query = `{
      user(sub: "${mockUser1.sub}") {
        id
        email
        sub
        firstName
        lastName
        createdAt
      }
    }`;

    jest.spyOn(User, 'count').mockReturnValue(Promise.resolve(1));
    const userFindOneSpy = jest.spyOn(User, 'findOne');

    when(userFindOneSpy)
      .calledWith({ sub: mockUser1.sub })
      .mockReturnValue(mockUser1);

    return graphql(schema, query, {}, {}).then((result) => {
      console.log(userFindOneSpy.mock.calls);
      expect(result).not.toBe(null);
      expect(result.data).toEqual({ user: mockUser1 });
    });
  });
});
