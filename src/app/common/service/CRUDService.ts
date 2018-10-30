import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ServiceUtil} from "./ServiceUtil";
import {map} from "rxjs/operators";
import {BackendResponse} from "../types/BackendResponse";
import {environment} from "../../../environments";

export abstract class CRUDService<T> {
  public _dataStream = new BehaviorSubject<T[]>([]);
  public dataStream = this._dataStream.asObservable();

  protected constructor(
    protected http: HttpClient,
    protected serviceRootApi: string,
    private getApi?: string = '/',
    private getAllApi?: string = '/all',
    private createApi?: string = '/',
    private deleteApi?: string = '/',
    private updateApi?: string = '/'
  ) {
    this.onInit();
  }

  protected abstract onInit();

  get(id: number | string, params?: HttpParams): Observable<T> {
    return this.http.get<BackendResponse<T>>(this.getServiceRootUrl() + this.getApi + id, { params })
      .pipe(map(ServiceUtil.extractObjectFromResponse));
  }

  getAll(params?: HttpParams): Observable<T[]> {
    return this.http.get<BackendResponse<T>>(this.getServiceRootUrl() + this.getAllApi, { params })
      .pipe(map(ServiceUtil.extractObjectFromResponse));
  }

  create(object: T, params?: HttpParams) {
    const createRequest = this.http.post(
      this.getServiceRootUrl() + this.createApi,
      ServiceUtil.wrapPayload(object),
      { params }
    );

    this.updateDataStream(createRequest);
    return createRequest;
  };

  update(id: number | string, object: T, params?: HttpParams) {
    const updateRequest = this.http.put(
      this.getServiceRootUrl() + this.updateApi + id,
      ServiceUtil.wrapPayload(object),
      { params }
    );

    this.updateDataStream(updateRequest);
    return updateRequest;
  };

  protected getServiceRootUrl() {
    return environment.baseApi + this.serviceRootApi;
  }

  delete(id: number | string, params?: HttpParams) {
    const deleteRequest = this.http.delete(this.deleteApi + id, { params });

    this.updateDataStream(deleteRequest);
    return deleteRequest;
  };

  protected updateDataStream(request?: Observable<any>) {
    const performUpdate = () => this.getAll().subscribe(result => this._dataStream.next(result));
    if (request) {
      request.subscribe(performUpdate);
    } else {
      performUpdate();
    }
  }
}
