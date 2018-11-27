import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {share} from 'rxjs/operators';

export abstract class MTRService<T extends { id: number | string}> {
  private _changesStream = new Subject<T[]>();
  public changesStream = this._changesStream.asObservable();

  protected constructor(
    protected http: HttpClient,
    protected serviceRootApi: string
  ) {}

  protected get(id: number | string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.buildServiceUrl(id), { params });
  }

  protected getAll(params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(this.buildServiceUrl(), { params });
  }

  protected create(object: T, params?: HttpParams) {
    const createRequest = this.http.post<T>(
      this.buildServiceUrl(),
      object,
      { params }
    ).pipe(share());

    createRequest.subscribe(() => this.updateDataStream());
    return createRequest;
  };

  protected update(object: T, params?: HttpParams) {
    if (typeof object.id !== 'number' && typeof object.id !== 'string') {
      return Observable.create(subscriber => subscriber.error('Given object needs a valid id-property (must be a number or string)'));
    }

    const updateRequest = this.http.put<T>(
      this.buildServiceUrl(object.id),
      object,
      { params }
    ).pipe(share());

    updateRequest.subscribe(() => this.updateDataStream());
    return updateRequest;
  };

  protected delete(id: number | string, params?: HttpParams) {
    const deleteRequest = this.http.delete(this.buildServiceUrl(id), { params }).pipe(share());

    deleteRequest.subscribe(() => this.updateDataStream());
    return deleteRequest;
  };

  protected buildServiceUrl(id?: number | string) {
    return environment.baseApi + this.serviceRootApi + (id != null ? `/${id}` : '');
  }

  public updateDataStream() {
    this.getAll().subscribe(result =>
      this._changesStream.next(result)
    );
  }
}
