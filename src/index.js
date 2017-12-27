"use strict";
const Promise = require("bluebird"),
    Router = require("koa-router");
class KoaRouterDataProvider {

    constructor(options) {
        const opts = options || {};
        this.router = opts.router;
    }

    get(path, query) {
        const self = this;
        return new Promise((resolve, reject) => {
            const ctx = {
                "method": "GET",
                path: path,
                query: query
            };
            self.getMiddleware()(
                ctx,
                () => {
                    self.onNotMatched();
                }
            )
                .then(() => {
                    return resolve(ctx.body);
                })
                .catch(err => {
                    err.status = err.status || 500;
                    return reject(err);
                });
        });
    }

    onNotMatched() {
        throw Object.assign(new Error("Not found"), {
            status: 404
        });
    }

    getMiddleware() {
        if (!this.middleware) {
            this.middleware = this.getRouter()
                .routes();
        }
        return this.middleware;
    }

    getRouter() {
        if (!this.router) {
            this.router = new Router();
        }
        return this.router;
    }
}

module.exports = KoaRouterDataProvider;
