# Restaurant Project

A web application which made for Restaurant Management\
Manager can manage their restaurant via the app\
Customer can order food using the application

## Deployment

To deploy this project run

```
  1) Install Docker
  2) Config the configuration file to your preferences
  2) Run `docker-compose up -d`
```

## API Reference

#### This will be provided in the future

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.

## Authors

- [@nutchayaporn-b](https://github.com/nutchayaporn-b)
- [@maikawinthida](https://github.com/maikawinthida)

## Tech Stack

**Client:** React, TailwindCSS, Framer-Motion

**Server:** Node, Express, Prisma
