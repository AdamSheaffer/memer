import { TestBed, inject } from '@angular/core/testing';

import { GiphyService } from './giphy.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('GiphyService', () => {
  const http = jasmine.createSpyObj('Http', ['get']);
  http.get.and.returnValue(of([]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GiphyService,
        {
          provide: HttpClient,
          useValue: http
        }
      ]
    });
  });

  it('should be created', inject([GiphyService], (service: GiphyService) => {
    expect(service).toBeTruthy();
  }));
});
