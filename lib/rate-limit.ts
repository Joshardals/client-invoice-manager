// import { Redis } from "@upstash/redis";

// const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;

// const redis = new Redis({
//   url: UPSTASH_REDIS_REST_URL!,
//   token: UPSTASH_REDIS_REST_TOKEN!,
// });

// export async function rateLimit(
//   identifier: string,
//   maxRequests: number = 5,
//   windowMs: number = 900000 // 15 minutes
// ) {
//   const now = Date.now();
//   const key = `ratelimit:${identifier}`;

//   const requests = (await redis.get<number[]>(key)) || [];
//   const recentRequests = requests.filter(
//     (timestamp) => now - timestamp < windowMs
//   );

//   if (recentRequests.length >= maxRequests) {
//     return { success: false };
//   }

//   recentRequests.push(now);
//   await redis.set(key, recentRequests, { ex: Math.floor(windowMs / 1000) });

//   return { success: true };
// }
