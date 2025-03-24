import { RoomService } from '../../room.service';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(() => {
    service = new RoomService();
    service.createRoom('room1');
    service.joinRoom('room1', 'client1');
  });

  it('should create a new room', () => {
    expect(service.getBids('room1')).toBe(0);
  });

  it('should add client to room', () => {
    expect(service.getClients('room1')).toContain('client1');
  });

  it('should remove client from room', () => {
    service.leaveRoom('room1', 'client1');
    expect(service.getClients('room1')).not.toContain('client1');
  });

  it('should validate bid is higher than current bid', () => {
    service.placeBid('room1', 100);
    expect(service.isBidValid('room1', 99)).toBe(false);
    expect(service.isBidValid('room1', 101)).toBe(true);
  });

  it('should update bid amount', () => {
    service.placeBid('room1', 100);
    expect(service.getBids('room1')).toBe(100);

    service.placeBid('room1', 200);
    expect(service.getBids('room1')).toBe(200);
  });
});
