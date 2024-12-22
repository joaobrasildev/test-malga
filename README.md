# Links

[Refinamento Miro](https://miro.com/app/board/uXjVL0yVHSM=/?moveToWidget=3458764611372257897&cot=14).

[Doc OpenApi](http://localhost:3000/api).

[Pull request](https://github.com/joaobrasildev/test-malga/pull/1).

[Commit list](https://github.com/joaobrasildev/test-malga/pull/1/commits).

[Branch](https://github.com/joaobrasildev/test-malga/tree/develop).

# Pré-requisitos:

- @nestjs/cli
- Docker
- docker-compose

# To run project
```bash
$ git checkout develop
```

```bash
$ npm i -g @nestjs/cli
```

```bash
$ npm i
```
- Setting you .env based ON .env.default

- Go to the root folder and RUN
```bash
$ docker compose up -d
```

- Apply migrations
```bash
$ npm run db:migrate
```

```bash
$ npm run start
```

- In the root folder has a application collection

# To run unit test
```bash
$ npm run test
```

# To run e2e test

- Navigate to the src/module/transaction/\_\_test\_\_/e2e folder and RUN
```bash
$ docker compose up -d
```

- apply migrations on database test:
```bash
$ npm run test:db:setup
```

- execute e2e tests RUN
```bash
$ npm run test:e2e
```