import { z } from "zod";
import { UrlService } from "../services/url.service";
import { UrlRepository } from "../repositories/url.repository";
import { CacheRepository } from "../repositories/cache.repo";
import logger from "../config/logger";
import { InternalServerError } from "../utils/errors/app.error";
import { publicProcedure } from "../router/trpc/context";


const urlService=new UrlService(new UrlRepository(),new CacheRepository());

export const urlController = {

    
    create:publicProcedure
    .input(
        z.object({
            originalUrl:z.string().url('invalid url'),
        })
    )
    .mutation(
        async({input})=>{
            try{
                const result=await urlService.createShortUrl(input.originalUrl);
                return result;
            }
            catch(error){
                logger.error('Error creating short url',error);
                throw new InternalServerError('Error creating short url');
            }
        }
    ),

    getOriginalUrl:publicProcedure.input(
        z.object({
            shortUrl:z.string().min(1,'short url is required')
        })
    )
    .query(
        async({input})=>{
            try{
                const result=await urlService.getOriginalUrl(input.shortUrl);
                return result;
            }
            catch(error){
                logger.error('Error fetching original url',error);
                throw new InternalServerError('Error fetching original url');
            }
        })
   }
