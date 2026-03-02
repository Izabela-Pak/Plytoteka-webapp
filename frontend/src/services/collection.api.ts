import api from "./jwt";

export const cdServices = {
    getAll: (email: String) => api.get(`/api/list`, { params: { email } }),
    create: (data: FormData) => api.post(`/api/create`, data),
    delete: (id: number) => api.delete(`/api/delete/${id}`),
    modify: (id: number, data: FormData) => api.put(`/api/modify/${id}`, data),
    getSpecific: (id: number) => api.get(`/api/cd/${id}`)
};

