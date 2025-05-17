import React, { createContext, useState, useEffect } from 'react';
import { getFavoritesByUser } from '../services/favoriteService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const cargarFavoritos = async () => {
            if (user?.id && user.user_type === 'Cliente') {
                const favs = await getFavoritesByUser(user.id);
                setFavorites(favs);
            } else {
                setFavorites([]); // limpia favoritos al cerrar sesión o cambiar tipo
            }
        };
        cargarFavoritos();
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, favorites, setFavorites }}>
            {children}
        </UserContext.Provider>
    );
};
