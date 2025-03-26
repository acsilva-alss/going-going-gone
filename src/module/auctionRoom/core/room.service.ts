import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  private readonly roomClients: Map<string, string[]> = new Map();
  private readonly roomBids: Map<string, number> = new Map();

  createRoom(room: string): void {
    this.roomClients.set(room, []);
    this.roomBids.set(room, 0);
  }

  joinRoom(room: string, clientId: string): void {
    this.roomClients.get(room).push(clientId);
    console.info(`client ${clientId} joined in room ${room}`);
  }

  leaveRoom(room: string, clientId: string): void {
    const clients = this.roomClients.get(room);
    clients.splice(clients.indexOf(clientId), 1);
    console.info(`client ${clientId} left room ${room}`);
  }

  isBidValid(room: string, amount: number): boolean {
    const currentBid = this.roomBids.get(room);
    return amount > currentBid;
  }

  placeBid(room: string, amount: number): void {
    this.roomBids.set(room, amount);
    console.info(`new bid ${amount} in room ${room}`);
  }

  getBids(room: string): number {
    return this.roomBids.get(room);
  }

  getClients(room: string): string[] {
    return this.roomClients.get(room);
  }
}
