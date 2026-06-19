const express = require('express');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const fs   = require('fs');
const path = require('path');

const app  = express();
const PORT = 3000;

// ===== FILE PATHS =====
const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');
const TASKS_FILE    = path.join(__dirname, 'data', 'tasks.json');
const MEMBERS_FILE  = path.join(__dirname, 'data', 'members.json');

// ===== INIT FILES =====
const defaultProjects = [
  { id:'p1', name:'E-Commerce Website', description:'Build a full online shopping platform with cart and payment', status:'In Progress', priority:'High', deadline:'2026-08-15', progress:60, color:'#3b82f6', createdAt:'2026-06-01T10:00:00Z' },
  { id:'p2', name:'Mobile Banking App', description:'Develop a secure mobile banking application with UPI support', status:'Planning', priority:'High', deadline:'2026-09-30', progress:20, color:'#8b5cf6', createdAt:'2026-06-03T09:00:00Z' },
  { id:'p3', name:'Company Portfolio', description:'Design and build a modern company portfolio website', status:'Completed', priority:'Medium', deadline:'2026-06-30', progress:100, color:'#22c55e', createdAt:'2026-05-15T08:00:00Z' },
  { id:'p4', name:'HR Management System', description:'Internal HR tool for managing employees and payroll', status:'In Progress', priority:'Medium', deadline:'2026-08-01', progress:45, color:'#f59e0b', createdAt:'2026-05-20T11:00:00Z' },
];

const defaultTasks = [
  { id:'t1', projectId:'p1', title:'Design homepage UI', description:'Create wireframes and final UI', status:'Done', priority:'High', assignee:'Priya S', dueDate:'2026-06-20', createdAt:'2026-06-01T10:00:00Z' },
  { id:'t2', projectId:'p1', title:'Build product listing page', description:'Fetch and display products from API', status:'In Progress', priority:'High', assignee:'Rahul M', dueDate:'2026-07-05', createdAt:'2026-06-02T10:00:00Z' },
  { id:'t3', projectId:'p1', title:'Implement cart functionality', description:'Add to cart, remove, update quantity', status:'To Do', priority:'High', assignee:'Nimitha BC', dueDate:'2026-07-20', createdAt:'2026-06-03T10:00:00Z' },
  { id:'t4', projectId:'p1', title:'Payment gateway integration', description:'Integrate Razorpay payment gateway', status:'To Do', priority:'Medium', assignee:'Rahul M', dueDate:'2026-08-01', createdAt:'2026-06-04T10:00:00Z' },
  { id:'t5', projectId:'p2', title:'Requirement gathering', description:'Collect all functional requirements', status:'Done', priority:'High', assignee:'Nimitha BC', dueDate:'2026-06-15', createdAt:'2026-06-03T09:00:00Z' },
  { id:'t6', projectId:'p2', title:'Database schema design', description:'Design tables for users, accounts, transactions', status:'In Progress', priority:'High', assignee:'Priya S', dueDate:'2026-07-10', createdAt:'2026-06-04T09:00:00Z' },
  { id:'t7', projectId:'p3', title:'Design mockups', description:'Create Figma mockups for all pages', status:'Done', priority:'Medium', assignee:'Nimitha BC', dueDate:'2026-05-25', createdAt:'2026-05-15T08:00:00Z' },
  { id:'t8', projectId:'p3', title:'Build and deploy site', description:'Code the site and deploy on GitHub Pages', status:'Done', priority:'High', assignee:'Rahul M', dueDate:'2026-06-28', createdAt:'2026-05-26T08:00:00Z' },
  { id:'t9', projectId:'p4', title:'Employee module', description:'Add, edit and manage employee records', status:'Done', priority:'High', assignee:'Priya S', dueDate:'2026-06-30', createdAt:'2026-05-20T11:00:00Z' },
  { id:'t10', projectId:'p4', title:'Payroll calculation', description:'Automate monthly payroll generation', status:'In Progress', priority:'High', assignee:'Nimitha BC', dueDate:'2026-07-20', createdAt:'2026-05-22T11:00:00Z' },
  { id:'t11', projectId:'p4', title:'Leave management', description:'Track and approve employee leave requests', status:'To Do', priority:'Medium', assignee:'Rahul M', dueDate:'2026-08-01', createdAt:'2026-05-23T11:00:00Z' },
];

const defaultMembers = [
  { id:'m1', name:'Nimitha BC', role:'Full Stack Developer', email:'nimitha@example.com', avatar:'NB', color:'#3b82f6', joinedAt:'2026-06-01T00:00:00Z' },
  { id:'m2', name:'Rahul M', role:'Frontend Developer', email:'rahul@example.com', avatar:'RM', color:'#8b5cf6', joinedAt:'2026-06-01T00:00:00Z' },
  { id:'m3', name:'Priya S', role:'UI/UX Designer', email:'priya@example.com', avatar:'PS', color:'#22c55e', joinedAt:'2026-06-01T00:00:00Z' },
];

if (!fs.existsSync(PROJECTS_FILE)) fs.writeFileSync(PROJECTS_FILE, JSON.stringify(defaultProjects, null, 2));
if (!fs.existsSync(TASKS_FILE))    fs.writeFileSync(TASKS_FILE,    JSON.stringify(defaultTasks,    null, 2));
if (!fs.existsSync(MEMBERS_FILE))  fs.writeFileSync(MEMBERS_FILE,  JSON.stringify(defaultMembers,  null, 2));

// ===== HELPERS =====
const readJSON  = (f) => JSON.parse(fs.readFileSync(f, 'utf-8'));
const writeJSON = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ===========================
// ===== PROJECT ROUTES =====
// ===========================

// GET all projects
app.get('/api/projects', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  const tasks    = readJSON(TASKS_FILE);
  // Attach task counts to each project
  const result = projects.map(p => ({
    ...p,
    totalTasks: tasks.filter(t => t.projectId === p.id).length,
    doneTasks:  tasks.filter(t => t.projectId === p.id && t.status === 'Done').length,
  }));
  res.json(result.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// GET single project
app.get('/api/projects/:id', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  const project  = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// CREATE project
app.post('/api/projects', (req, res) => {
  const { name, description, status, priority, deadline, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name is required' });
  const projects = readJSON(PROJECTS_FILE);
  const newProject = {
    id: uuidv4(), name, description: description || '',
    status: status || 'Planning', priority: priority || 'Medium',
    deadline: deadline || '', progress: 0,
    color: color || '#3b82f6', createdAt: new Date().toISOString()
  };
  projects.push(newProject);
  writeJSON(PROJECTS_FILE, projects);
  res.json(newProject);
});

// UPDATE project
app.put('/api/projects/:id', (req, res) => {
  let projects = readJSON(PROJECTS_FILE);
  const idx    = projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  projects[idx] = { ...projects[idx], ...req.body };
  writeJSON(PROJECTS_FILE, projects);
  res.json(projects[idx]);
});

// DELETE project
app.delete('/api/projects/:id', (req, res) => {
  let projects = readJSON(PROJECTS_FILE);
  let tasks    = readJSON(TASKS_FILE);
  projects = projects.filter(p => p.id !== req.params.id);
  tasks    = tasks.filter(t => t.projectId !== req.params.id);
  writeJSON(PROJECTS_FILE, projects);
  writeJSON(TASKS_FILE, tasks);
  res.json({ message: 'Project deleted' });
});

// ===========================
// ===== TASK ROUTES =====
// ===========================

// GET tasks for a project
app.get('/api/projects/:id/tasks', (req, res) => {
  const tasks = readJSON(TASKS_FILE).filter(t => t.projectId === req.params.id);
  res.json(tasks.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(readJSON(TASKS_FILE).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// CREATE task
app.post('/api/tasks', (req, res) => {
  const { projectId, title, description, status, priority, assignee, dueDate } = req.body;
  if (!projectId || !title) return res.status(400).json({ error: 'Project and title required' });
  const tasks   = readJSON(TASKS_FILE);
  const newTask = {
    id: uuidv4(), projectId, title,
    description: description || '', status: status || 'To Do',
    priority: priority || 'Medium', assignee: assignee || 'Unassigned',
    dueDate: dueDate || '', createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  writeJSON(TASKS_FILE, tasks);
  // Auto-update project progress
  updateProjectProgress(projectId);
  res.json(newTask);
});

// UPDATE task status
app.put('/api/tasks/:id', (req, res) => {
  let tasks = readJSON(TASKS_FILE);
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body };
  writeJSON(TASKS_FILE, tasks);
  updateProjectProgress(tasks[idx].projectId);
  res.json(tasks[idx]);
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readJSON(TASKS_FILE);
  const task = tasks.find(t => t.id === req.params.id);
  tasks = tasks.filter(t => t.id !== req.params.id);
  writeJSON(TASKS_FILE, tasks);
  if (task) updateProjectProgress(task.projectId);
  res.json({ message: 'Task deleted' });
});

// ===========================
// ===== MEMBER ROUTES =====
// ===========================

app.get('/api/members', (req, res) => res.json(readJSON(MEMBERS_FILE)));

app.post('/api/members', (req, res) => {
  const { name, role, email, color } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'Name and role are required' });
  const members = readJSON(MEMBERS_FILE);
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const newMember = {
    id: uuidv4(), name, role, email: email || '',
    avatar: initials, color: color || '#3b82f6',
    joinedAt: new Date().toISOString()
  };
  members.push(newMember);
  writeJSON(MEMBERS_FILE, members);
  res.json(newMember);
});

app.delete('/api/members/:id', (req, res) => {
  let members = readJSON(MEMBERS_FILE);
  members = members.filter(m => m.id !== req.params.id);
  writeJSON(MEMBERS_FILE, members);
  res.json({ message: 'Member removed' });
});

// ===== STATS =====
app.get('/api/stats', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  const tasks    = readJSON(TASKS_FILE);
  const members  = readJSON(MEMBERS_FILE);
  res.json({
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    inProgressProjects: projects.filter(p => p.status === 'In Progress').length,
    totalTasks: tasks.length,
    doneTasks: tasks.filter(t => t.status === 'Done').length,
    inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
    todoTasks: tasks.filter(t => t.status === 'To Do').length,
    totalMembers: members.length,
  });
});

// ===== AUTO UPDATE PROGRESS =====
function updateProjectProgress(projectId) {
  const tasks = readJSON(TASKS_FILE).filter(t => t.projectId === projectId);
  if (tasks.length === 0) return;
  const done     = tasks.filter(t => t.status === 'Done').length;
  const progress = Math.round((done / tasks.length) * 100);
  let projects   = readJSON(PROJECTS_FILE);
  const idx      = projects.findIndex(p => p.id === projectId);
  if (idx !== -1) {
    projects[idx].progress = progress;
    if (progress === 100) projects[idx].status = 'Completed';
    writeJSON(PROJECTS_FILE, projects);
  }
}

app.listen(PORT, () => console.log(`✅ Project Management Dashboard running at http://localhost:${PORT}`));
