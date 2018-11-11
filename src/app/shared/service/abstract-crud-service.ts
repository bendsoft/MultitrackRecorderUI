import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {share} from 'rxjs/operators';

export abstract class CRUDService<T extends { id: number | string}> {
  public _dataStream = new BehaviorSubject<T[]>([]);
  public dataStream = this._dataStream.asObservable();

  protected constructor(
    protected http: HttpClient,
    protected serviceRootApi: string
  ) {}

  get(id: number | string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.buildServiceUrl(id), { params });
  }

  getAll(params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(this.buildServiceUrl(), { params });
  }

  create(object: T, params?: HttpParams) {
    const createRequest = this.http.post<T>(
      this.buildServiceUrl(),
      object,
      { params }
    ).pipe(share());

    createRequest.subscribe(() => this.updateDataStream());
    return createRequest;
  };

  update(object: T, params?: HttpParams) {
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

  delete(id: number | string, params?: HttpParams) {
    const deleteRequest = this.http.delete(this.buildServiceUrl(id), { params }).pipe(share());

    deleteRequest.subscribe(() => this.updateDataStream());
    return deleteRequest;
  };

  protected buildServiceUrl(id?: number | string) {
    return environment.baseApi + this.serviceRootApi + (id != null ? `/${id}` : '');
  }

  public updateDataStream() {
    this.getAll().subscribe(result =>
      this._dataStream.next(result)
    );
  }
}
