import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AuctionRoomModule } from '../../room.module';

describe('AuctionRoom', () => {
  let app: INestApplication;
  let clientSocket: Socket;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuctionRoomModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(3000);

    clientSocket = io('http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: false,
    });
  });

  beforeEach((done) => {
    clientSocket.connect();
    clientSocket.on('connect', () => {
      done();
    });
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a room', (done) => {
    clientSocket.on('roomCreated', (room: string) => {
      expect(room).toBe('test-room');
      done();
    });

    clientSocket.emit('createRoom', 'test-room');
  });
});
