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
    const [lastSearchTerm, setLastSearchTerm] = useState<string | undefined>(undefined); // Track last search term
    const [executionLoading, setExecutionLoading] = useState<string | null>(null); // Track which task is running

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const fetchTasks = async (searchTerm?: string) => {
        setLoading(true);
        let data: any[] = [];

        try {
            console.log('FetchTasks called with searchTerm:', searchTerm); // Debug: Log search term
            if (!searchTerm || searchTerm.trim() === '') {
                data = await getAllTasks(); // Use your original simple approach
                console.log('Raw All Tasks Response:', data); // Debug: Log raw response
                if (!Array.isArray(data)) {
                    console.warn('getAllTasks did not return an array:', data);
                    data = [];
                }
            } else {
                const isLikelyId = /^[a-zA-Z0-9]+$/.test(searchTerm) && searchTerm.length < 10;

                if (isLikelyId) {
                    try {
                        const taskResponse = await findTaskById(searchTerm);
                        console.log('Raw Task by ID Response:', taskResponse); // Debug: Log raw response
                        if (taskResponse) {
                            // Handle both single object and array responses
                            if (Array.isArray(taskResponse)) {
                                data = taskResponse.map(task => ({
                                    id: task.id || 'N/A',
                                    name: task.name || 'N/A',
                                    owner: task.owner || 'N/A',
                                    command: task.command || 'N/A',
                                    taskExecutions: task.taskExecutions || []
                                }));
                            } else {
                                data = [{
                                    id: taskResponse.id || 'N/A',
                                    name: taskResponse.name || 'N/A',
                                    owner: taskResponse.owner || 'N/A',
                                    command: taskResponse.command || 'N/A',
                                    taskExecutions: taskResponse.taskExecutions || []
                                }];
                            }
                        }
                        console.log('Mapped Task by ID:', data); // Debug: Log mapped data
                    } catch (idError: any) {
                        console.error('Error fetching task by ID:', idError); // Debug: Log error
                        if (idError.response && idError.response.status !== 404) {
                            throw idError;
                        }
                        data = [];
                    }
                }

                if (data.length === 0) {
                    data = await findTasksByName(searchTerm);
                }
            }

            setTasks(data);
            console.log('Tasks State Set To:', data); // Debug: Log state update
            if (searchTerm && data.length === 0) {
                message.warning(`No tasks found matching "${searchTerm}" by ID or Name.`);
            }
            setLastSearchTerm(searchTerm); // Update last search term
        } catch (error: any) {
            console.error('Fetch error details:', error.response ? error.response.data : error); // Debug: Log detailed error
            if (error.response && error.response.status === 404) {
                setTasks([]);
                message.warning(`No task found with ID/Name matching "${searchTerm}".`);
            } else {
                message.error('Failed to fetch tasks. Check console for details.');
            }
        } finally {
            setLoading(false);
            console.log('Current Tasks State After Fetch:', tasks); // Debug: Log state after render
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
                    fetchTasks(lastSearchTerm); // Use last search term
                } catch (error) {
                    message.error('Failed to delete task.');
                }
            },
        });
    };

    const handleRunCommand = async (id: string) => {
        setExecutionLoading(id); // Set loading state for the specific task
        const startTime = Date.now(); // Record start time for debugging
        try {
            await executeTask(id);
            message.success('Command executed successfully!');
            fetchTasks(lastSearchTerm); // Use last search term to preserve context
        } catch (error) {
            message.error('Failed to execute command.');
        } finally {
            const endTime = Date.now();
            console.log(`Task ${id} execution took ${endTime - startTime} ms`); // Debug: Log execution time
            setExecutionLoading(null); // Clear loading state
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
                        loading={executionLoading === record.id} // Show loading indicator
                        disabled={executionLoading !== null} // Disable other runs while one is in progress
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
                allowClear
                onChange={(e) => {
                    if (!e.target.value) fetchTasks(''); // Trigger fetch on clear
                }}
            />
            <Table
                columns={columns}
                dataSource={tasks}
                loading={loading}
                rowKey={(record) => record.id || `${record.name}-${record.owner}-${record.command}`}
                locale={{ emptyText: 'No data' }}
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