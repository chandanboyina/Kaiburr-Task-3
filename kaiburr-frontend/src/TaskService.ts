// src/services/TaskService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080/tasks';

export const getAllTasks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const findTaskById = async (id: string) => {
    const response = await axios.get(`${API_URL}?id=${id}`);
    return response.data;
};

export const createTask = async (task: any) => {
    const response = await axios.put(API_URL, task);
    return response.data;
};

export const deleteTask = async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const findTasksByName = async (name: string) => {
    const response = await axios.get(`${API_URL}?name=${name}`);
    return response.data;
};

export const executeTask = async (id: string) => {
    const response = await axios.put(`${API_URL}/${id}/execute`);
    return response.data;
};