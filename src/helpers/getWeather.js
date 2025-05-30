
import axios from "axios";

const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-34.6131&longitude=-58.3772&hourly=temperature_2m&timezone=auto";

export const getTemperaturas = async () => {
  const respuesta = await axios.get(API_URL);
  return respuesta.data.hourly.temperature_2m; //trae el array entero
};