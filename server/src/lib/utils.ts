// tslint:disable: import-name
import { Request, Response, NextFunction } from 'express';
import socketIO from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    sessionId?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}

/**
 * Middleware to check if user if logged in
 * If not logged responds with error
 */
export function accessControl(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  if (!req.session || !req.session.userId) {
    return res.status(403).json({ error: 'Unauthorized acess' });
  }
  next();
}

export function isDate(val: any): boolean {
  return val instanceof Date;
}

// converts header cookies field into object
export function parseCookies(cookieString: string | undefined): Record<string, string> {
  return cookieString
    ? cookieString.split('; ').reduce(
      (cookies: Record<string, string>, item: string) => {
        const [key, value] = item.split('=');
        cookies[key] = value;
        return cookies;
      },
      {},
    )
    : {};
}

// decode base64
export function decode64(str: string): string {
  return Buffer.from(str, 'base64').toString('utf8');
}

// socket middleware to attach session.sig cookie value to client object
export function socketSessionIdParser(client: socketIO.Socket, next: (err?: any) => void) {
  const cookies = parseCookies(client.handshake.headers.cookie);

  // no socket capability if sessionId cannot be found
  if (!cookies['session.sig']) return next(Error('Cannot retrieve the session Id'));

  // attach 'sessionId' key to client object
  client.sessionId = cookies['session.sig'];
  next();
}

// express middleware to attach session.sig cookie value to req object
export function sessionIdParser(req: Request, res: Response, next: NextFunction) {
  const cookies = parseCookies(req.headers.cookie);

  // if (!cookies['session.sig']) return next(Error('Cannot retrieve the session Id'));

  // attach 'sessionId' key to req object
  req.sessionId = cookies['session.sig'];
  next();
}
