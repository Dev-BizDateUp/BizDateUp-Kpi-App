import api from "../../api"

export async function createBadge(body) {
    try {
        const res = await api.post('/api/badge/create-badge', body);
        return { result: res, error: null };    
    } catch (exc) {
        return { error: exc, result: null };
    }
}