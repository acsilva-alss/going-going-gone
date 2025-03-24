import { Module } from '@nestjs/common';
import { RoomGateway } from './websocket/room.gateway';
import { RoomService } from './core/room.service';

@Module({
  providers: [RoomGateway, RoomService],
})
export class AuctionRoomModule {}
