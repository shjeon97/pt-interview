import { Test, TestingModule } from '@nestjs/testing';
import { NormService } from './norm.service';

describe('NormService', () => {
  let service: NormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NormService],
    }).compile();

    service = module.get<NormService>(NormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
