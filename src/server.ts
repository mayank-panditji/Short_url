import express from "express";
import { serverConfig } from "./config";
import v1Router from "./router/v1/index.router";
import v2Router from "./router/v2/index.router";
import logger from "./config/logger";
import { genericErrorHandler } from "./middleware/error.middleware";
import { attachCorrelationIdMiddleware } from "./middleware/correlation.middleware";
import { initRedis } from "./config/redis";
import { connectDB } from "./config/db";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { trpcRouter } from "./router/trpc";
import { CacheRepository } from "./repositories/cache.repo";
import { UrlRepository } from "./repositories/url.repository";
import { Request, Response } from "express";
import { UrlService } from "./services/url.service";

const app = express();

app.use(attachCorrelationIdMiddleware);
app.use("/api", express.json());
app.use("/trpc", createExpressMiddleware({ router: trpcRouter }));

app.get("/:shortUrl", async (req: Request, res: Response) => {
  const shortUrl = Array.isArray(req.params.shortUrl)
    ? req.params.shortUrl[0]
    : req.params.shortUrl;
  const urlService = new UrlService(new UrlRepository(), new CacheRepository());
  const url = await urlService.getOriginalUrl(shortUrl);

  if (!url) {
    return res.status(404).json({
      success: false,
      message: "url not found",
    });
  }

  await urlService.incrementClicks(shortUrl);
  return res.redirect(url.originalUrl);
});

app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

app.use(genericErrorHandler);

app.listen(serverConfig.PORT, async () => {
  logger.info(`server is running at ${serverConfig.PORT}`);
  logger.info("Server started successfully", { data: "some additional data" });
  await initRedis();
  await connectDB();
});