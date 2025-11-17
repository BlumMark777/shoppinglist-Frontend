import axios from "axios";

const BASE_URL = "http://localhost:8080/entries";

export async function fetchTobuys() {
  const res = await axios.get(BASE_URL);
  return res.data;
}

export async function createTobuy({ name }) {
  const res = await axios.post(BASE_URL, { name });
  return res.data;
}

export async function deleteTobuy(id) {
  await axios.delete(`${BASE_URL}/${id}`);
}

export async function togglePurchased(id) {
  const res = await axios.put(`${BASE_URL}/${id}/togglePurchased`);
  return res.data;
}

export async function toggleFavorite(id) {
  const res = await axios.put(`${BASE_URL}/${id}/toggleFavorite`);
  return res.data;
}




