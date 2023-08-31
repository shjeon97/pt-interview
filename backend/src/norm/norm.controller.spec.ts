import { Test, TestingModule } from '@nestjs/testing';
import { NormController } from './norm.controller';

describe('NormController', () => {
  let controller: NormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NormController],
    }).compile();

    controller = module.get<NormController>(NormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
