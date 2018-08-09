import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Http } from '@angular/http';
import { RequestOptionsArgs } from '@angular/http/src/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {

  private imageCount = 4;
  private baseURL = 'https://api.giphy.com/v1/gifs/search';
  private giphy = environment.giphy;

  constructor(private http: Http) { }

  getRandomImages(tagName: string): Promise<any> {
    const randomNums = this.randomWithMax(100, this.imageCount);
    const categoryRequests = this.getRandomImagePromises(tagName, randomNums);
    const wildcardRequest = this.getWildcardPromise();
    const imageRequests = [...categoryRequests, wildcardRequest];

    return Promise.all(imageRequests).then(responses => {
      return responses.map(r => r.data[0].images.fixed_height.url);
    });
  }

  private getRandomImagePromises(tagName: string, indices: number[]): Promise<any>[] {
    const imageRequests = [];
    for (let i = 0; i < indices.length; i++) {
      const args = this.buildParams(tagName, indices[i]);
      const req = this.http.get(this.baseURL, args).toPromise().then(res => res.json());
      imageRequests.push(req);
    }
    return imageRequests;
  }

  private getWildcardPromise(): Promise<any> {
    const rands = this.randomWithMax(200, 1);
    const rand = rands[0];
    const args = this.buildParams('gifsoup', rand);
    return this.http.get(this.baseURL, args).toPromise().then(res => res.json());
  }

  private buildParams(tagName: string, offset: number): RequestOptionsArgs {
    const params = {
      api_key: this.giphy,
      q: this.encodeTag(tagName),
      rating: 'pg-13',
      limit: '1',
      offset
    };
    return { params };
  }

  private encodeTag(tagName: string): string {
    return tagName.replace(' ', '+');
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
