import { Module } from '@nestjs/common';
import { AuctionRoomModule } from './module/auctionRoom/room.module';

@Module({
  imports: [AuctionRoomModule],
})
export class AppModule {}
