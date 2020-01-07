# API Documentation

<strong>Backend deployed at Heroku:</strong> <https://moodmuse-production.herokuapp.com/backend>

<strong>Staging env is deployed at:</strong> <https://moodmuse.herokuapp.com/>

Access GraphQL with the endpoint `/backend`. Database requires an Auth token.

## Getting started

To get the server running locally:

- Clone this repo
- **yarn install** to install all required dependencies
- **yarn server** to start the local server
- **yarn test** to start server using testing environment

### Node.js, Express, GraphQL, MongoDB/Mongoose

We chose our back-end technology to be flexible and easy to change as needed due to our project being a greenfield project. We knew that lots of changes will occur as the application develops and wanted to make setting up the database quick and painless.

## Queries

<details>
<summary>GET Users</summary>

```graphql
{
  users {
    id
    email
    firstName
    lastName
    createdAt
    moods {
      id
      mood
      text
      anxietyLevel
      sleep
      createdAt
      userId
      weather
    }
  }
}
```

</details>

<details>
<summary>GET User By Email</summary>

```graphql
{
  user(email: "example@email.com") {
    id
    email
    firstName
    lastName
    createdAt
    moods {
      id
      mood
      text
      anxietyLevel
      sleep
      createdAt
      userId
      weather
    }
    tasks {
      id
      completedAt
      prompt
      text
      photoUrl
    }
  }
}
```

</details>

## Mutations

<details>
<summary>addMood by User ID</summary>

```graphql
mutation {
  addMood(
    mood: 2
    text: "Today I was happy because I got a promotion at my job!"
    anxietyLevel: 5
    sleep: 7.5
    userId: "5dcc9396d36d5ecc1234a218"
    weather: "Rainy 24°"
  ) {
    id
    mood
    text
    anxietyLevel
    sleep
    createdAt
    userId
    weather
  }
}
```

</details>

<details>
<summary>removeMood by Mood ID</summary>

```graphql
mutation {
  removeMood(id: "5dcc9396d36d5ecc7833a218") {
    id
    mood
    text
    anxietyLevel
    sleep
    createdAt
    weather
  }
}
```

</details>

<details>
<summary>editMood by Mood ID</summary>

```graphql
mutation {
  editMood(
    mood: 3
    text: "I was sad today because I wasn't able to make it to my friend's birthday"
    anxietyLevel: 0
    sleep: 8.0
    id: "5dd4a493d3e27c123cc43af4"
  ) {
    id
    mood
    text
    anxietyLevel
    sleep
    createdAt
  }
}
```

</details>

<details>
  <summary>addTask by User ID</summary>

```graphql
mutation {
  addTask(
    userEmail: "email@gmail.com"
    prompt: "I am statements"
    text: "awesome, cool, lovable, talented, generous"
    photoUrl: "www.coolphoto.com"
  ) {
    id
    completedAt
    prompt
    text
    photoUrl
  }
}
```

</details>

<details>
  <summary>removeTask by task ID</summary>

```graphql
mutation {
  removeTask(id: "5dfd2649a9984b24598e73f5") {
    id
  }
}
```

</details>

## Data Model

### USERS

---

```javascript
{
  id: UUID;
  email: STRING;
  firstName: STRING;
  lastName: STRING;
  isSharingLocation: BOOLEAN;
  google: {
    username: STRING;
    googleId: STRING;
  }
  createdAt: TIMESTAMP;
}
```

### MOOD ENTRIES

---

```javascript
{
  id: UUID;
  mood: INT;
  text: STRING;
  anxietyLevel: INT;
  sleep: DOUBLE / FLOAT;
  createdAt: TIMESTAMP;
  userId: STRING;
  weather: STRING;
}
```

### Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

```none
    *  PORT - dynamic port the server is listening on
    *  MONGODB_URI - MongoDB connection string
    *  NODE_ENV - Node environment
    *  JWT_TOKEN_SECRET - Shh, it's a secret
    *  GOOGLE_CLIENT_SECRET - For connecting with Google auth
    *  GOOGLE_CLIENT_ID - Also for connecting with Google auth
```

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/ema-therapy-fe/blob/master/README.md) for details on the front end of our project.
