import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

interface Client {
  ws: WebSocket;
  assignmentId?: string;
}

class WSManager {
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, Client>();

  init(server: any) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const clientId = Math.random().toString(36).slice(2);
      this.clients.set(clientId, { ws });

      ws.on('message', (data: Buffer) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'subscribe' && msg.assignmentId) {
            const client = this.clients.get(clientId);
            if (client) client.assignmentId = msg.assignmentId;
          }
        } catch {}
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
      });

      ws.send(JSON.stringify({ type: 'connected', clientId }));
    });

    console.log('WebSocket server initialized');
  }

  notifyAssignment(assignmentId: string, payload: any) {
    const message = JSON.stringify({ type: 'assignment_update', assignmentId, ...payload });
    this.clients.forEach((client) => {
      if (client.assignmentId === assignmentId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  broadcast(payload: any) {
    const message = JSON.stringify(payload);
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }
}

export const wsManager = new WSManager();
