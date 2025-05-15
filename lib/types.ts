export interface Project {
  id: string
  title: string
  description: string
  students: string[]
  category: string
  progress: number
  startDate: string
  endDate: string
  status: string
}

export interface Task {
  id: string
  project: string
  name: string
  description: string
  assignedStudent: string
  status: string
  dueDate: string
}

export interface User {
  id: string
  name: string
  role: string
  email: string
}
