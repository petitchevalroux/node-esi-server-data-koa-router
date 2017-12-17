"use strict";
const Router = require("koa-router"),
    path = require("path"),
    Provider = require(path.join(__dirname, "..")),
    router = new Router(),
    provider = new Provider({
        router: router
    }),
    assert = require("assert"),
    Promise = require("bluebird");

describe("provider", () => {
    router.get("/users/:id", (ctx, next) => {
        if (ctx.params.id === "1") {
            ctx.body = {
                "id": 1,
                "name": "John Doe",
                "email": "john.doe@example.com"
            };
        } else {
            return next();
        }
    });

    router.get("/users", (ctx) => {
        return new Promise(resolve => {
            ctx.body = [];
            if (ctx.query.name === "John Doe") {
                ctx.body.push({
                    "id": 1,
                    "name": "John Doe",
                    "email": "john.doe@example.com"
                });
            }
            return resolve(ctx.body);
        });
    });

    it("return context body", () => {
        return provider
            .get("/users/1")
            .then(user => {
                assert.deepEqual(user, {
                    "id": 1,
                    "name": "John Doe",
                    "email": "john.doe@example.com"
                });
                return user;
            });
    });

    it("return an error with 404 status when not found", () => {
        return provider
            .get("/users/404")
            .catch(err => {
                assert.equal(err.status, 404);
            });
    });

    it("pass second query arguments to context", () => {
        return provider
            .get("/users", {
                "name": "John Doe"
            })
            .then(users => {
                assert.deepEqual(users, [{
                    "id": 1,
                    "name": "John Doe",
                    "email": "john.doe@example.com"
                }]);
                return users;
            });
    });

    it("return an error with 500 status when an error occured", () => {
        return provider
            .get("/users")
            .catch(err => {
                assert.equal(err.status, 500);
            });
    });
});
