import api from "../api";

export async function getAllAppraisals() {
    try {
        const res = await api.get('/api/appraisal');
        return { result: res, error: null };
    } catch (exc) {
        return { error: exc, result: null };
    }
}

export async function getAppraisals_emp(empID) {
    try {
        const res = await api.get(`/api/appraisal/emp/${encodeURIComponent(empID)}`);
        return { result: res.data, error: null };
    } catch (exc) {
        return { result: null, error: exc };
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

export async function editAppraisal(body, id) {
    try {
        body.id = undefined;
        body.employee_id = undefined;
        const res = await api.patch(`/api/appraisal/${encodeURIComponent(id)}`, body);
        return { result: res, error: null };
    } catch (exc) {
        return { error: exc, result: null };
    }
}
