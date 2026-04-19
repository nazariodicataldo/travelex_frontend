export type Meta = {
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  next: string | null;
  prev: string | null;
  allPages: {
    [key: string]: string;
  }[];
};

export type BackendResponse<T = unknown> =
  | {
      success: true;
      timestamp: string;
      data: T;
      message?: string;
      meta: Meta;
    }
  | {
      success: false;
      timestamp: string;
      errors: string;
      message?: string;
    };

export const myEnv = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  backendUrlApi: process.env.NEXT_PUBLIC_BACKEND_URL + "/api",
};

export async function myFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  token?: string,
) {
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(myEnv.backendUrlApi + input, {
    ...init,
    headers: {
      // Imposta JSON solo se NON è un FormData
      ...(!isFormData && { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  //Lancio un errore che dice che il token è scaduto o non valido
  if (res.status === 401) {
    throw new SessionExpiredError();
  }

  const resJson: BackendResponse<T> = await res.json();

  if (!resJson.success) {
    throw new Error(
      typeof resJson.errors === "string"
        ? resJson.errors
        : JSON.stringify(resJson.errors),
    );
  }
  return resJson.data;
}

// Errore custom per la sessione scaduta
export class SessionExpiredError extends Error {
  constructor() {
    super("Expired session");
    this.name = "SessionExpiredError";
  }
}
