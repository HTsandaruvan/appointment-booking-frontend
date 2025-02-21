export const checkAuth = (router) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (!token) {
        router.push("/auth/login");
        return;
    }

    return { role };
};
