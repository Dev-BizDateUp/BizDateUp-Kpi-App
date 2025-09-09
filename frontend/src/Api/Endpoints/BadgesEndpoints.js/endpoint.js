import api from "../../api"

export async function createBadge(body) {
    try {
        const res = await api.post('/api/badge/create-badge', body);
        return { result: res, error: null };
    } catch (exc) {
        return { error: exc, result: null };
    }
}

// This Api call fetches particular employee badges he/she had given to another employee for that month
export async function getEmployees_provided_badges(id) {
    try {
        const res = await api.get(`/api/badge/get-employee-badge/${encodeURIComponent(id)}`);
        return { result: res.data };
    } catch (exc) {
        return { error: exc };
    }
}

export async function get_all_badges_for_particular_emp(id) {
    try {
        const res = await api.get(`/api/badge/get-all-badges/${encodeURIComponent(id)}`);
        return { result: res.data };
    } catch (exc) {
        return { error: exc };
    }
}


export async function get_all_approved_badges_for_particular_emp(id) {
    try {
        const res = await api.get(`/api/badge/get-approved-badge-count/${encodeURIComponent(id)}`);
        return { result: res.data };
    } catch (exc) {
        return { error: exc };
    }
}

// Admin Routes

export async function getallbadges() {
    try {
        const res = await api.get(`/api/badge/query`);
        return { result: res.data };
    } catch (exc) {
        return { error: exc };
    }
}


export async function approvebadge(id, body) {
    try {
        const res = await api.patch(`/api/badge/actions/${id}`, body);
        console.log(res);
        return { result: res, error: null };
    } catch (exc) {
        return { error: exc, result: null };
    }
}

export async function getinallbadges() {
    try {
        const res = await api.get(`/api/badge/get-all-badges-for-admin`);
        return { result: res.data };
    } catch (exc) {
        return { error: exc };
    }
}
