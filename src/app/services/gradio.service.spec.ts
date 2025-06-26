import { TestBed } from '@angular/core/testing';

import { GradioService } from './gradio.service';

describe('GradioService', () => {
  let service: GradioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
