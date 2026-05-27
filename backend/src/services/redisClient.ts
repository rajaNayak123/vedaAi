import IORedis, { RedisOptions } from 'ioredis';

/**
 * Creates an IORedis connection that automatically handles TLS.
 * - rediss:// → TLS enabled (Render external / Upstash)
 * - redis://  → No TLS (Render internal)
 */
export function createRedisClient(extraOptions: Partial<RedisOptions> = {}): IORedis {
  const url = process.env.REDIS_URL;

  if (!url) {
    console.error('❌ REDIS_URL environment variable is not set!');
    console.error('   Set it in your Render dashboard → Environment → REDIS_URL');
    process.exit(1);
  }

  const useTLS = url.startsWith('rediss://');

  const options: RedisOptions = {
    maxRetriesPerRequest: null,
    ...(useTLS ? { tls: { rejectUnauthorized: false } } : {}),
    ...extraOptions,
  };

  console.log(`[Redis] Connecting to: ${url.replace(/:\/\/.*@/, '://***@')} (TLS: ${useTLS})`);
  return new IORedis(url, options);
}
