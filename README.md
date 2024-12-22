# Links

[Refinamento Miro](https://miro.com/app/board/uXjVL0yVHSM=/?moveToWidget=3458764611372257897&cot=14).

[Pull request](https://github.com/joaobrasildev/test-malga/pull/1).

[Commit list](https://github.com/joaobrasildev/test-malga/pull/1/commits).

[Branch](https://github.com/joaobrasildev/test-malga/tree/develop).

# Pré-requisitos:

- @nestjs/cli
- Docker
- docker-compose

# To run project
```bash
$ npm i -g @nestjs/cli
```

```bash
$ npm i
```
- Go to the root folder and RUN
```bash
$ docker compose up -d
```
- Setting you .env based ON .env.default
```bash
$ npm run start
```

- Apply migrations
```bash
$ npm run db:migrate
```

- In the root folder has a application collection

# To run unit test
```bash
$ npm run test
```

# To run e2e test

- Navigate to the src/module/transaction/__test__/e2e folder and RUN
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