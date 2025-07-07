import api from "../api";

export async function getAllAppraisals() {
    try {
        const res = await api.get('/api/appraisal');
        return { result: res, error: null };
    } catch (exc) {
        return { error: exc, result: null };
    }
}