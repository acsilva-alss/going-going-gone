import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AuctionRoomModule } from '../../room.module';

describe('AuctionRoom', () => {
  let app: INestApplication;
  let clientSocket: Socket;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuctionRoomModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(5000);

    clientSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: false,
    });
    clientSocket.connect();
  });

  afterAll(async () => {
    await app.close();
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  it('should create a room', (done) => {
    clientSocket.on('roomCreated', (room: string) => {
      expect(room).toBe('test-room');
      done();
    });

    clientSocket.emit('createRoom', 'test-room');
  });

  it('should join a room', (done) => {
    clientSocket.on('joinedRoom', (room: string) => {
      expect(room).toBe('test-room');
      done();
    });

    clientSocket.emit('joinRoom', 'test-room');
  });

  it('should place a bid in a room', (done) => {
    clientSocket.on('bidPlaced', (data: { room: string; amount: number }) => {
      expect(data.room).toBe('test-room');
      expect(data.amount).toBe(100);
      done();
    });

    clientSocket.emit('placeBid', { room: 'test-room', amount: 100 });
  });

  it('should reject a bid if number is less than current bid', (done) => {
    clientSocket.on('bidRejected', (data: { room: string; amount: number }) => {
      expect(data.room).toBe('test-room');
      expect(data.amount).toBe(100);
      done();
    });

    clientSocket.emit('placeBid', { room: 'test-room', amount: 100 });
  });
});
