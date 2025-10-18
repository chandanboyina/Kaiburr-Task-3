// src/components/TaskForm.tsx
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { createTask } from './TaskService.ts';

const TaskForm: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            await createTask(values);
            message.success('Task created successfully!');
            form.resetFields();
        } catch (error) {
            message.error('Failed to create task.');
        }
    };

    return (
        <div className="task-form-card">
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="id" label="Task ID" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="name" label="Task Name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="owner" label="Owner" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="command" label="Command" rules={[{ required: true }]}>
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Button style={{ backgroundColor: '#4b0082', borderColor: '#4b0082' }} type="primary" htmlType="submit">
                    Create Task
                </Button>
            </Form.Item>
        </Form>
        </div>
    );
};

export default TaskForm;