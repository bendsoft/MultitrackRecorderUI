import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ServiceUtil} from "./ServiceUtil";
import {environment} from "../../../environments/environment";

export abstract class CRUDService<T> {
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
    const createRequest = this.http.post(
      this.buildServiceUrl(),
      ServiceUtil.wrapPayload(object),
      { params }
    );

    createRequest.subscribe(() => this.updateDataStream());
    return createRequest;
  };

  update(id: number | string, object: T, params?: HttpParams) {
    const updateRequest = this.http.put(
      this.buildServiceUrl(id),
      ServiceUtil.wrapPayload(object),
      { params }
    );

    updateRequest.subscribe(() => this.updateDataStream());
    return updateRequest;
  };

  delete(id: number | string, params?: HttpParams) {
    const deleteRequest = this.http.delete(this.buildServiceUrl(id), { params });

    deleteRequest.subscribe(() => this.updateDataStream());
    return deleteRequest;
  };

  protected buildServiceUrl(id?: number | string) {
    return environment.baseApi + this.serviceRootApi + (id != null ? `/${id}` : '');
  }

  protected updateDataStream() {
    this.getAll().subscribe(result =>
      this._dataStream.next(result)
    );
  }
}
