// Reusable request config helper
export const createRequest = (method: "GET" | "POST" | "DELETE" | "PUT",data?: any) => {
    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
        }
    }
    if(data) {
        config.body = JSON.stringify(data);
    }
    return config;
}