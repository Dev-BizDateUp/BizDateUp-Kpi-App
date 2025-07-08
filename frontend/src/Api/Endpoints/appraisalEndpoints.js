import api from "../api";

export async function getAllAppraisals() {
    try {
        const res = await api.get('/api/appraisal');
        return { result: res, error: null };
    } catch (exc) {
        return { error: exc, result: null };
    }
}

export async function createAppraisal(body) {
    try {
        const res = await api.post('/api/appraisal', body);
        return { result: res, error: null };
    } catch (exc) {
        return { error: exc, result: null };
    }
}