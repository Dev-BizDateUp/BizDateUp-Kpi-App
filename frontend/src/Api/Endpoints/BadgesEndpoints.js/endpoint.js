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
        console.log(res);
        return { result: res.data };
    } catch (exc) {
        return { error: exc };
    }
}

export async function get_all_badges_for_particular_emp(id) {
    try {
        const res = await api.get(`/api/badge/get-all-badges/${encodeURIComponent(id)}`);
        console.log(res);
        return { result: res.data };
    } catch (exc) {
        return { error: exc };
    }
}
