// src/components/Task.tsx
import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Input, Modal, message } from 'antd';
import {
    getAllTasks,
    deleteTask,
    findTasksByName,
    executeTask,
    findTaskById
} from './TaskService.ts';

const { Search } = Input;

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const fetchTasks = async (searchTerm?: string) => {
        setLoading(true);
        let data: any[] = [];

        try {
            if (!searchTerm) {
                data = await getAllTasks();
            } else {
                const isLikelyId = /^[a-zA-Z0-9]+$/.test(searchTerm) && searchTerm.length < 10;

                if (isLikelyId) {
                    try {
                        const task = await findTaskById(searchTerm);
                        if (task) data = [task];
                    } catch (idError: any) {
                        if (idError.response && idError.response.status !== 404) {
                            throw idError;
                        }
                    }
                }

                if (data.length === 0) {
                    data = await findTasksByName(searchTerm);
                }
            }

            setTasks(data);
            if (searchTerm && data.length === 0) {
                message.warning(`No tasks found matching "${searchTerm}" by ID or Name.`);
            }

        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setTasks([]);
                message.warning(`No task found with ID/Name matching "${searchTerm}".`);
            } else {
                console.error(error);
                message.error('Failed to fetch tasks.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = (id: string, name: string) => {
        Modal.confirm({
            title: `Confirm Deletion`,
            content: `Are you sure you want to delete the task: "${name}" (ID: ${id})? This action cannot be undone.`,
            okText: 'Yes, Delete It',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deleteTask(id);
                    message.success('Task deleted successfully!');
                    fetchTasks();
                } catch (error) {
                    message.error('Failed to delete task.');
                }
            },
        });
    };

    const handleRunCommand = async (id: string) => {
        try {
            await executeTask(id);
            message.success('Command executed successfully!');
            fetchTasks();
        } catch (error) {
            message.error('Failed to execute command.');
        }
    };

    const handleShowOutput = (record: any) => {
        setSelectedTask(record);
        setIsModalVisible(true);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Owner', dataIndex: 'owner', key: 'owner' },
        { title: 'Command', dataIndex: 'command', key: 'command' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_text: string, record: any) => (
                <Space size="middle">
                    <Button
                        style={{ backgroundColor: '#4b0082', borderColor: '#4b0082' }}
                        type="primary"
                        onClick={() => handleRunCommand(record.id)}
                    >
                        Run
                    </Button>
                    <Button onClick={() => handleShowOutput(record)}>Output</Button>
                    <Button type="primary" danger onClick={() => handleDelete(record.id, record.name)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Search
                placeholder="Search tasks by name or ID"
                onSearch={fetchTasks}
                style={{ width: 300, marginBottom: 16, borderStyle: 'solid', color: 'black', borderRadius: 10 }}
            />
            <Table
                columns={columns}
                dataSource={tasks}
                loading={loading}
                rowKey={(record) => record.id || `${record.name}-${record.owner}-${record.command}`}
            />

            <Modal
                title={`Output History for Task ID: ${selectedTask?.id}`}
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                {selectedTask?.taskExecutions?.length > 0 ? (
                    selectedTask.taskExecutions.map((exec: any, index: number) => (
                        <div
                            key={exec.id || `${exec.startTime}-${exec.endTime}-${index}`}
                            style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}
                        >
                            <p><strong>Execution {index + 1}</strong></p>
                            <p><strong>Start Time:</strong> {formatDate(exec.startTime)}</p>
                            <p><strong>End Time:</strong> {formatDate(exec.endTime)}</p>
                            <p><strong>Output:</strong></p>
                            <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
                                {exec.output || 'No output recorded.'}
                            </pre>
                        </div>
                    ))
                ) : (
                    <p>No execution history found for this task.</p>
                )}
            </Modal>
        </>
    );
};

export default Tasks;
