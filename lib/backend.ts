export type BackendResponse<T> =
  | {
      success: true;
      timestamp: string;
      data: T;
      message?: string;
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
