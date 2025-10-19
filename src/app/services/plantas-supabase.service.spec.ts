import { TestBed } from '@angular/core/testing';

import { PlantasSupabaseService } from './plantas-supabase.service';

describe('PlantasSupabaseService', () => {
  let service: PlantasSupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantasSupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
