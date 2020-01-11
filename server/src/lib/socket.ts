/*
* Socket interface
*/

// tslint:disable: import-name
import socketIO from 'socket.io';
import http from 'http';
import { socketSessionIdParser } from './utils';

export type SocketParams = {
  server: http.Server,
  path?: string,
};

export type SocketEmitOptions = {
  eventKey?: string,
  sessionId?: string,
  queue?: string,
};

export type SocketBroadcastOptions = {
  eventKey?: string,
  queue?: string,
};

export default class Socket {

  private io: socketIO.Server | null = null;
  // CLIENT LOOKUP
  // sessionId to client
  private clients: Record<string, socketIO.Socket> = {};
  // client to sessinId
  private sessions: Map<socketIO.Socket, string> = new Map();

  // SUBSCRIPTIONS LOOKUP - uses set instead of arrays for constant time add/delete operations
  // event to sockets
  private events: Record<string, Record<string, Set<socketIO.Socket>>> = {};
  // socket to events
  private subscriptions: Map<socketIO.Socket, Record<string, Set<string>>> = new Map();

  private static instances: Socket[] = [];
  private static instanceEqualityChecks: (keyof SocketParams)[] = ['server', 'path'];

  constructor(private params: SocketParams) {
    const existingInstance = Socket.findInstance(params);
    if (existingInstance) return existingInstance;

    this.io = params.path
      ? socketIO(params.server, { path: params.path })
      : socketIO(params.server);

    // register middleware to attach sessionId to client objects
    this.io.use(socketSessionIdParser);

    // init
    this.io.on('connection', (client) => {
      this.registerSocket(client);
      client.on('disconnect', () => this.unregisterSocket(client));
    });

    Socket.registerInstance(this);
  }

  private static findInstance(params: SocketParams): Socket | undefined {
    return this.instances.find(
      (instance: Socket): boolean => {
        return this.instanceEqualityChecks.every((param): boolean => instance.params[param] === params[param]);
      });
  }

  private static registerInstance(instance: Socket): void {
    this.instances.push(instance);
  }

  private registerSocket(client: socketIO.Socket) {
    // add client to lookup maps
    const sessionId = client.sessionId!;
    this.clients[sessionId] = client;
    this.sessions.set(client, sessionId);
  }

  private unregisterSocket(client: socketIO.Socket) {
    const sessionId = client.sessionId!;

    // unsubscribe from all
    this.unsubscribe(sessionId);

    // remove client from lookup maps
    delete this.clients[sessionId];
    this.sessions.delete(client);

  }

  public subscribe(sessionId: string, event: string, eventKey = 'default'): this {
    const client = this.clients[sessionId];
    if (!client) throw Error('Socket client is not registered');

    // add client to event
    this.events[event] = this.events[event] || {};
    this.events[event][eventKey] = this.events[event][eventKey] || new Set();
    this.events[event][eventKey].add(client);

    // add event to client's subscriptions
    const subscriptions = this.subscriptions.get(client) || {};
    subscriptions[event] = subscriptions[event] || new Set();
    subscriptions[event].add(eventKey);
    this.subscriptions.set(client, subscriptions);

    return this;
  }

  // unsubscribe from all if event is not supplied
  public unsubscribe(sessionId: string, event?: string, eventKey?: string): this {

    const client = this.clients[sessionId];

    // client should always exist when function called from unregisterSocket
    if (!client) throw Error('Socket client is not registered');
    const subscriptions = this.subscriptions.get(client);
    // exit if no subscriptions
    if (!subscriptions) return this;

    // unsubscribe from individual event
    if (event) {
      this.events[event] = this.events[event] || {};

      // unsubscribe from eventKey only if supplied
      if (eventKey) {
        this.events[event][eventKey] && this.events[event][eventKey].delete(client);
        // remove from subscriptions
        subscriptions[event].delete(eventKey);

        return this;
      }

      // remove from event
      this.events[event].default && this.events[event].default.delete(client);
      // remove from subscriptions
      delete subscriptions[event];

      return this;
    }

    // unsubscribe client from all subscriptions
    for (const [subscription, eventKeys] of Object.entries(subscriptions)) {
      // unsubscribe from individual eventKeys
      for (const eventKey of eventKeys) {
        this.unsubscribe(sessionId, subscription, eventKey);
      }
      // unsubscribe from event
      this.unsubscribe(sessionId, subscription);
    }

    // delete client key in subscriptions
    this.subscriptions.delete(client);

    return this;

  }

  emit(event: string, data: any, options: SocketEmitOptions = {}): this {
    // set default options parameters
    const eventKey = options.eventKey || 'default';
    const sessionId = options.sessionId;
    const queue = options.queue;

    // get subscribers for event
    const clients = this.events[event] && this.events[event][eventKey];

    // exit if event was never initialized i.e. has no subscribers
    if (!clients) return this;

    // single client
    if (sessionId) {
      const client = this.clients[sessionId];
      client && (queue !== undefined
        && client.emit(queue || 'queue', { event, eventKey, data })
        || client.emit(event, { eventKey, data })
      );
      return this;
    }

    // broadcast
    for (const client of clients) {
      queue !== undefined
        && client.emit(queue || 'queue', { event, eventKey, data })
        || client.emit(event, { eventKey, data });
    }

    return this;
  }

  broadcast(event: string, data: any, options: SocketBroadcastOptions): this {
    this.emit(event, data, options);
    return this;
  }

  broadcastToQueue(event: string, data: any, options: SocketBroadcastOptions): this {
    // set default options parameters
    const queue = options.queue || 'queue';
    this.emit(event, data, { ...options, queue });
    return this;
  }

}