import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {

  private imageCount = 4;
  private pageSize = 12;
  private baseURL = 'https://api.giphy.com/v1/gifs/search';
  private giphy = environment.giphy;

  constructor(private http: HttpClient) { }

  getRandomImages(tagName: string): Promise<any> {
    const randomNums = this.randomWithMax(100, this.imageCount);
    const categoryRequests = this.getRandomImagePromises(tagName, randomNums);
    const wildcardRequest = this.getWildcard();
    const imageRequests = [...categoryRequests, wildcardRequest];

    return Promise.all(imageRequests).then(responses => {
      return responses.map(r => r.data[0].images.fixed_height.url);
    });
  }

  getPage(query: string, page: number): Promise<{ thumbnail: string, img: string }[]> {
    const offset = (page - 1) * this.pageSize;
    const params = this.buildParams(query, offset, this.pageSize);
    return this.http.get(this.baseURL, { params }).toPromise()
      .then((response: any) => {
        return response.data.map(i => {
          const thumbnail = i.images.fixed_width_small.url;
          const img = i.images.fixed_height.url;
          return { thumbnail, img };
        });
      });
  }

  private getRandomImagePromises(tagName: string, indices: number[]): Promise<any>[] {
    const imageRequests = [];
    for (let i = 0; i < indices.length; i++) {
      const params = this.buildParams(tagName, indices[i]);
      const req = this.http.get(this.baseURL, { params }).toPromise();
      imageRequests.push(req);
    }
    return imageRequests;
  }

  getWildcard(): Promise<any> {
    const rands = this.randomWithMax(200, 1);
    const rand = rands[0];
    const params = this.buildParams('gifsoup', rand);
    return this.http.get(this.baseURL, { params }).toPromise();
  }

  private buildParams(tagName: string, offset: number, limit = 1): HttpParams {
    return new HttpParams()
      .append('api_key', this.giphy)
      .append('q', this.encodeTag(tagName))
      .append('rating', 'pg-13')
      .append('limit', `${limit}`)
      .append('offset', offset.toString());
  }

  private encodeTag(tagName: string): string {
    return tagName.replace(/\s/g, '+');
  }

  private randomWithMax(max: number, count: number, ): number[] {
    const rands = [];
    while (rands.length < count) {
      const rand = Math.round(Math.random() * max);
      if (rands.includes(rand)) { continue; }
      rands.push(rand);
    }
    return rands;
  }

}
