import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token) {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // Treat invalid token as expired
    }
}
export function getMonthName(monthNumber) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const index = parseInt(monthNumber, 10) - 1;
    return months[index] || monthNumber;
}
