import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import { RoomService } from '../core/room.service';

@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class RoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private roomService: RoomService) {}
  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  afterInit(): void {
    console.log('Socket server initialized on port');
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: Socket, room: string): void {
    this.roomService.createRoom(room);
    client.emit('roomCreated', room);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, room: string): Promise<void> {
    await client.join(room);
    this.roomService.joinRoom(room, client.id);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, room: string): Promise<void> {
    await client.leave(room);
    client.emit('leftRoom', room);
    this.roomService.leaveRoom(room, client.id);
  }

  @SubscribeMessage('placeBid')
  handleBid(client: Socket, data: { room: string; amount: number }): void {
    if (this.roomService.isBidValid(data.room, data.amount)) {
      console.log('chegou aqui');
      this.roomService.placeBid(data.room, data.amount);
      this.server.to(data.room).emit('newBid', {
        bidder: client.id,
        amount: data.amount,
        timestamp: new Date(),
      });
      client.emit('bidPlaced', {
        room: data.room,
        amount: data.amount,
      });
    } else {
      client.emit('bidRejected', {
        room: data.room,
        amount: data.amount,
      });
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }
}
