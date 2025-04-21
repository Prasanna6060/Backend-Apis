import ratelimit from 'express-rate-limit';

export const authLimiter = ratelimit({
    windowMs:  5 * 60 * 1000,
    max: 5,
    message: {
        status: 429,
        message: 'Too many login attempts. Try again after 5 minutes.'
      },
      keyGenerator: (req) => req.ip
})