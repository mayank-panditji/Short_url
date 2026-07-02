import { UrlRepository } from "../repositories/url.repository";
import { CacheRepository } from "../repositories/cache.repo";
import { toBase62 } from "../utils/base62";

import { serverConfig } from "../config";
import { create } from "node:domain";
import { NotFoundError } from "../utils/errors/app.error";


export class UrlService {

    constructor( 
        private readonly urlRepository: UrlRepository,
        private readonly cacheRepository: CacheRepository) {}
        async createShortUrl(originalUrl:string)
        {
            const nextId=await this.cacheRepository.getNextId();
            const shortUrl=toBase62(nextId);
            const url=await this.urlRepository.create({originalUrl,shortUrl});
            //cache the url mapping in redis for faster retrieval
            await this.cacheRepository.setUrlMapping(shortUrl,originalUrl);

            const baseUrl=serverConfig.BASE_URL
            const fullUrl=`${baseUrl}/${shortUrl}`;
            return {
                id:url._id.toString(),
                originalUrl,
                shortUrl,
                fullUrl,
                createdAt:url.createdAt,
                updatedAt:url.updatedAt
            }
        }

        async getOriginalUrl(shortUrl:string){
            //check in cache first
            const originalUrl=await this.cacheRepository.getUrlMapping(shortUrl);
            if(originalUrl){
                return {
                    originalUrl,
                    shortUrl
                }
            }
            const url=await this.urlRepository.findStatsByShortUrl(shortUrl);
            if(!url){
                throw new NotFoundError('URL not found');
            }
            await this.urlRepository.incrementClick(shortUrl);
            await this.cacheRepository.setUrlMapping(shortUrl,url.originalUrl);
            return {
                originalUrl:url.originalUrl,
                shortUrl
            }
        }

        async incrementClicks(shortUrl:string){
            await this.urlRepository.incrementClick(shortUrl)
            return;
        }

}