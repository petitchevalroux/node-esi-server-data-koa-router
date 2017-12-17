# esi-server-data-koa-router

[koa-router](https://www.npmjs.com/package/koa-router) based data provider for [esi-server](https://github.com/petitchevalroux/node-esi-server)

## Usage
### Configuration

```javascript
const Router = require("koa-router"),
    Provider = require("esi-server-data-koa-router"),
    router = new Router(),
    provider = new Provider({router:router});
// Defining route
router.get("/users/:id", (ctx, next) => {
    if (ctx.params.id === "1") {
        ctx.body = {"id": 1, "name": "John Doe", "email": "john.doe@example.com"};
    } else {
        next();
    }
});
```

### Fetching data
```javascript
provider
    .get("/users/1")
    .then( user => {
        console.log(user); // {"id":1,"name":"John Doe","email":"john.doe@example.com"}
    });
```

### 404 handling
```javascript
provider
    .get("/users/404")
    .catch( err => {
        console.log(err.message, err.status); // Not found 404
    });
```

