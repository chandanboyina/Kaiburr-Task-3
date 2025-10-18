# Kaiburr Task 3: WEB UI Frontend (Taskboard)

Kaiburr Task 3: WEB UI Frontend (Taskboard)
This repository contains the solution for Kaiburr Assessment Task 3, which involves building a responsive Web UI frontend for the REST API created in Task 1.

* **Technology Stack: React 19, TypeScript, and Ant Design.

* **Assessment Focus: Usability and Accessibility.

---
## Project setup and Execution

## 1. Prerequesites

* **Node.js (LTS version)

* **The Task 1 Java Backend must be running on http://localhost:8080 (or http://localhost:30007 if using Kubernetes NodePort).

## 2. Installation and Start-up

1. Clone the Repository:
   
 ```bash
 git clone https://github.com/chandanboyina/Kaiburr-Task-3
 ```

2. Installation Dependencies

 ```bash
 npm install
 ```

3. Run the Applications

 ```bash
 npm run dev
 ```
The application will open in your browser, typically at http://localhost:5173

## 2.WEB UI Functionality

The application is designed as a responsive Taskboard with a custom header and two main sections: a central form and a task table. All core CRUD and execution features are available, as required.

A. Create Records (Task Form)

Uses an attractive, responsive form built with Ant Design to submit a new task to the backend's PUT /tasks endpoint.

![HomePage]()

B. Show Record

The table loads all existing tasks on startup

![HomePage]()

C.Search Task

The search bar filters tasks by matching text against the 'Name' field, using the backend's GET /tasks?name= endpoint.

![HomePage]()

D. Delete Task

The 'Delete' button in the 'Actions' column removes a task via the DELETE /tasks/{id} endpoint.
Here Task with "id" 131 was Deleted.

![HomePage]()

![HomePage]()

E. Run or Execute Task

The 'Run' button calls the backend's PUT /tasks/{id}/execute endpoint.

![Homepage]()

F. Task Output

The 'Output' button opens an accessible modal window to display the full history of taskExecutions for that record.

![Homepage]()





