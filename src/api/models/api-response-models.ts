import {ViewHalamanModel} from '../../../modules/berkaca/models/berkaca.model';

export interface CoreResponseApi {
  success: boolean;
  status: boolean;
}

export type PaginateResponse = {
  limit: number;
  page: number;
  sort: string;
  total_rows: number;
  total_pages: number;
};

export type ErrorInterface = {
  message: string;
};

export type DataResponse =
  | {
      [k: string]: any;
    }
  | Array<{[k: string]: any}>;

export interface HttpResponse<T> extends CoreResponseApi {
  data: T;
  details: {
    path: string;
    query: string;
    status_code: number;
    method: string;
    status: string;
  };
  errors: {
    [key: string]: [string];
  } | null;
  error?: string;
  message: string;
}

export interface HttpResponseForGraph<T> extends HttpResponse<T> {
  info: ViewHalamanModel;
  sumber1: string[];
  sumber2: string[];
  notes1: string[];
  notes2: string[];
  notes_1_wilayah_1: string[];
  notes_1_wilayah_2: string[];
  notes_2_wilayah_1: string[];
  notes_2_wilayah_2: string[];
  satuan: {
    dataset_1: string;
    dataset_2: string;
  };
  jumlah_penduduk_1: string;
  jumlah_penduduk_2: string;
  parent_label_1: string;
  parent_label_2: string;
}

export interface HttpResponseVersionCode {
  status: boolean;
  version: string;
  isForceUpdate?: boolean;
  message: string;
}

export interface HttpResponsePaginate<T> extends CoreResponseApi {
  meta: {
    route: string;
    method: string;
    query: string;
    code: number;
    status: string;
  };
  details: {
    path: string;
    query: string;
    status_code: number;
    method: string;
    status: string;
  };
  errors: {
    [key: string]: [string];
  } | null;
  message: string;
  data: paginate<T>;
}

export interface ResponseUseCase<T> {
  valid: boolean;
  message: string;
  status_code?: number;
  data?: T | null;
}

export interface ResponseUseCasePaginate<T> {
  valid: boolean;
  message: string;
  status_code?: number;
  data?: paginate<T>;
}

export interface paginate<T> {
  rows?: T;
  limit: number;
  page: number;
  sort: string;
  total_rows: number;
  total_pages: number;
  FilterValue: Array<any> | null;
}

// wilayah jelajah
