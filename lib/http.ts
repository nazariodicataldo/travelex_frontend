import axios from "axios";
import { BackendResponse, myEnv } from "./backend";

export const http = axios.create({
  baseURL: myEnv.backendUrlApi,
});

//Creazione di un intercettore per mappare la richiesta del backend
http.interceptors.response.use(
  (response) => {
    const backendData = response.data;

    // Se il backend risponde con success: false
    if (!backendData.success) {
      return Promise.reject(
        new Error(backendData.message || "Internal server error"),
      );
    }

    // Estraiamo solo il contenuto di 'data' così i servizi ricevono solo quello che serve
    return backendData.data;
  },
  (error) => {
    // Gestisce errori HTTP (404, 500, ecc.)
    return Promise.reject(error);
  },
);
