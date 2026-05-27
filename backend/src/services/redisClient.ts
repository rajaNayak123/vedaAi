import IORedis, { RedisOptions } from 'ioredis';

export function createRedisClient(extraOptions: Partial<RedisOptions> = {}): IORedis {
  const url = process.env.REDIS_URL;

  if (!url) {
    console.error('❌ REDIS_URL is not set! Check your Render environment variables.');
    console.error('   Current env keys:', Object.keys(process.env).filter(k => k.includes('REDIS')));
    throw new Error('REDIS_URL environment variable is required');
  }

  const useTLS = url.startsWith('rediss://');

  const options: RedisOptions = {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...(useTLS ? { tls: { rejectUnauthorized: false } } : {}),
    ...extraOptions,
  };

  console.log(`[Redis] Connecting to: ${url.replace(/:\/\/[^@]+@/, '://***@')} (TLS: ${useTLS})`);
  return new IORedis(url, options);
}