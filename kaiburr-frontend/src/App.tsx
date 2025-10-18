// src/App.tsx
// src/App.tsx
import React from 'react';
// Note: Use a relative path without .tsx extension for imports
import TaskForm from './TaskForm.tsx';
import Tasks from './Task.tsx';
import { Layout } from 'antd';
import './App.css';

// Import the logo image. Assuming you placed it in src/assets/
import KaiburrLogo from './assets/kaiburr logo 2.jpg';

const { Header, Content } = Layout;

const App: React.FC = () => {
    return (
        <Layout>
            {/* Header: Apply custom class for styling the logo and text */}
            <Header className="app-header-custom">
                <div className="header-content">
                    {/* Display the logo and the company name */}
                    <img src={KaiburrLogo} alt="Kaiburr Logo" className="header-logo" />
                    {/* We'll use CSS to style 'KAIBURR' attractively */}
                    <h1 className="header-title"><div></div></h1>
                </div>
            </Header>

            <Content style={{ padding: '50px 24px' }}>
                <div className="task-app-wrapper">

                    {/* Main Title Section: Taskboard - Placed in the top middle */}
                    <div className="main-title-container">
                        <h2>TaskBoard</h2>
                    </div>

                    {/* Form Section Wrapper - For the attractive background image */}
                    <div className="form-section-wrapper">
                        {/* TaskForm component will use the 'task-form-card' class internally */}
                        <TaskForm />
                    </div>

                    {/* Tasks Table Section - For attractive table design */}
                    <div className="tasks-table-section">
                        <h3>Current Records</h3>
                        <Tasks />
                    </div>

                </div>
            </Content>
        </Layout>
    );
};

export default App;