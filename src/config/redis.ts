import {createClient} from 'redis'
import { serverConfig } from '.';
export const redisClient = createClient({
    url:serverConfig.REDIS_URL
})
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect',()=>{
    console.log('Redis connected');
});

export async function initRedis(){
    try{
        await redisClient.connect();
    }catch(err){
        console.log("redis connection error",err);
        throw err;
    }
}
export async function closeRedis(){ 
        await redisClient.quit();
}
