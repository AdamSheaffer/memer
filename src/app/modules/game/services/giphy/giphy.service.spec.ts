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

  it('should fetch page one of a paginated list of gifs', () => {
    const giphyResponse = {
      data: [
        {
          images: {
            fixed_height: { url: 'foo.jpg' },
            fixed_width_small: { url: 'small_foo.jpg' }
          }
        },
        {
          images: {
            fixed_height: { url: 'foo2.jpg' },
            fixed_width_small: { url: 'small_foo_2.jpg' }
          }
        }
      ]
    };

    const query = 'Evil Dead 2';
    service.getPage(query, 1).then(r => {
      httpMock.verify();
      expect(r.length).toBe(2);
      expect(r[0].img).toBe('foo.jpg');
      expect(r[0].thumbnail).toBe('small_foo.jpg');
    });

    const req = httpMock.expectOne(_r => true);
    const params = req.request.params;
    expect(params.get('q')).toBe('Evil+Dead+2');
    expect(params.get('limit')).toBe('12');
    expect(params.get('offset')).toBe('0');
    req.flush(giphyResponse);
  });

  it('should fetch page two of a paginated list of gifs', () => {
    const query = 'Evil Dead 2';
    service.getPage(query, 2);

    const req = httpMock.expectOne(_r => true);
    const params = req.request.params;
    expect(params.get('q')).toBe('Evil+Dead+2');
    expect(params.get('limit')).toBe('12');
    expect(params.get('offset')).toBe('12');
  });
});
