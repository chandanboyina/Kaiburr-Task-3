// src/components/Task.tsx
import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Input, Modal, message } from 'antd';
import { getAllTasks, deleteTask, findTasksByName, executeTask } from './TaskService.ts';

const { Search } = Input;

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    const fetchTasks = async (name?: string) => {
        setLoading(true);
        try {
            const data = name ? await findTasksByName(name) : await getAllTasks();
            setTasks(data);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id);
            message.success('Task deleted successfully!');
            fetchTasks();
        } catch (error) {
            message.error('Failed to delete task.');
        }
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
                    <Button style={{ backgroundColor: '#4b0082', borderColor: '#4b0082' }} type="primary" onClick={() => handleRunCommand(record.id)}>Run</Button>
                    <Button onClick={() => handleShowOutput(record)}>Output</Button>
                    <Button type="primary" danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Search
                placeholder="Search tasks by name"
                onSearch={fetchTasks}
                style={{ width: 300, marginBottom: 16, borderStyle: 'solid', color: 'black', borderRadius:10 }}
            />
            <Table columns={columns} dataSource={tasks} loading={loading} rowKey="id" />
            <Modal
                title="Command Output"
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
            >
                {selectedTask?.taskExecutions?.map((exec: any) => (
                    <p key={exec.startTime}>{exec.output}</p>
                ))}
            </Modal>
        </>
    );
};

export default Tasks;