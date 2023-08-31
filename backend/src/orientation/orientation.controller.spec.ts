import { Test, TestingModule } from '@nestjs/testing';
import { OrientationController } from './orientation.controller';

describe('OrientationController', () => {
  let controller: OrientationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrientationController],
    }).compile();

    controller = module.get<OrientationController>(OrientationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
