import { TestBed, inject, fakeAsync, tick, getTestBed } from '@angular/core/testing';

import { GiphyService } from './giphy.service';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('GiphyService', () => {
  let injector: TestBed;
  let service: GiphyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GiphyService
      ]
    });
    injector = getTestBed();
    service = injector.get(GiphyService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a promise of giphy urls', () => {
    const giphyResponse = {
      data: [
        {
          images: {
            fixed_height: { url: 'foo.jpg' }
          }
        }
      ]
    };

    service.getRandomImages('category').then(urls => {
      expect(urls.length).toBe(5);
      expect(urls[0]).toBe('foo.jpg');
    });

    const req = httpMock.match((_r) => true);
    req.forEach(r => r.flush(giphyResponse));
  });
});
