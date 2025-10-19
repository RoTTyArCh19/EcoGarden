import { TestBed } from '@angular/core/testing';

import { NotasSupabaseService } from './notas-supabase.service';

describe('NotasSupabaseService', () => {
  let service: NotasSupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotasSupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
