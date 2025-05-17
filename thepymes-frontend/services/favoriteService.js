// services/favoriteService.js
import axios from 'axios';
import { API_URL } from '@env';

export const getFavoritesByUser = async (user_id) => {
    const res = await axios.get(`${API_URL}/favorites/${user_id}`);
    return res.data;
};

export const addFavorite = async (user_id, business_id) => {
    const res = await axios.post(`${API_URL}/favorites`, { user_id, business_id });
    return res.data;
};

// ✅ CORREGIDO: usamos `data` para enviar body en DELETE
export const removeFavorite = async (user_id, business_id) => {
    const res = await axios.delete(`${API_URL}/favorites`, {
        data: { user_id, business_id }, // 👈 así se envía el body en DELETE
    });
    return res.data;
};
