import axios from "axios";

const BASE_URL = "https://webtech-lo13.onrender.com/tobuys";



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

export function filterTobuys(tobuys, query) {
    if (!query) return tobuys;

    return tobuys.filter((tobuy) =>
        tobuy.name.toLowerCase().includes(query.toLowerCase())
    );
}

export function toggleDarkMode() {
    const current = localStorage.getItem("darkMode") === "true";
    const next = !current;

    localStorage.setItem("darkMode", next);
    return next;
}
//aktuellen Dark Mode Status lesen */
export function isDarkModeEnabled() {
    return localStorage.getItem("darkMode") === "true";
}




