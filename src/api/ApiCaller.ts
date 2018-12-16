import * as R from 'ramda';

const API_ADDRESS = 'http://localhost:3000';

type StringMap = { [s: string]: string };

type CallParams = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Object;
  params?: StringMap;
};

export const ApiCaller = {
  call: async <T>({
    body,
    method = 'GET',
    params,
    url,
  }: CallParams): Promise<T> => {
    if (!/^http/.test(url)) {
      url = `${API_ADDRESS}${url}`;
    }

    const serializedParams = serialize(params || {});
    if (serializedParams) {
      url = `${url}?${serializedParams}`;
    }
    const response = await fetch(url, {
      body: body ? JSON.stringify(body) : undefined,
      method,
    });

    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    } else {
      throw await response.json();
    }
  },
};

const serialize = (obj: StringMap) => {
  return R.pipe(
    R.mapObjIndexed<string, string>((value, key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }),
    R.values,
    R.join('&'),
  )(obj);
};
