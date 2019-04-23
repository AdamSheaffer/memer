import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Wraps a given function in a blob and runs it in a web worker
// Credits to:
// https://github.com/start-javascript/ngx-web-worker/blob/master/web-worker.ts
// https://medium.com/@damoresac/using-web-workers-on-angular-6-6fd0490d07b5

@Injectable({
  providedIn: 'root'
})
export class WebworkerService {
  private workerFunctionToUrlMap = new WeakMap<Function, string>();
  private subjectToWorkerMap = new WeakMap<Subject<any>, Worker>();

  run<T>(workerFunction: (input: any) => any, data?: any): Subject<T> {
    const url = this.getOrCreateWorkerUrl(workerFunction);
    return this.runUrl(url, data);
  }

  runUrl<T>(url: string, data?: any): Subject<T> {
    const worker = new Worker(url);
    const subject$ = this.createSubjectForWorker<T>(worker, data);

    this.subjectToWorkerMap.set(subject$, worker);

    return subject$;
  }

  terminate(subject$: Subject<any>): Subject<any> {
    return this.removeSubject(subject$);
  }

  getWorker(subject$: Subject<any>): Worker {
    return this.subjectToWorkerMap.get(subject$);
  }

  private createSubjectForWorker<T>(worker: Worker, data: any): Subject<T> {
    const subject$ = new Subject<T>();
    worker.addEventListener('message', (event) => {
      subject$.next(event.data);
    });
    worker.addEventListener('error', subject$.error);
    worker.postMessage(data);

    return subject$;
  }

  private getOrCreateWorkerUrl(fn: Function): string {
    if (!this.workerFunctionToUrlMap.has(fn)) {
      const url = this.createWorkerUrl(fn);
      this.workerFunctionToUrlMap.set(fn, url);
      return url;
    }
    return this.workerFunctionToUrlMap.get(fn);
  }

  private createWorkerUrl(resolve: Function): string {
    const resolveString = resolve.toString();
    const webWorkerTemplate = `
        self.addEventListener('message', function(e) {
            ((${resolveString})(e.data));
        });
    `;
    const blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
    return URL.createObjectURL(blob);
  }

  private removeSubject<T>(subject$: Subject<T>): Subject<T> {
    const worker = this.subjectToWorkerMap.get(subject$);
    if (worker) {
      worker.terminate();
    }
    this.subjectToWorkerMap.delete(subject$);
    return subject$;
  }
}
