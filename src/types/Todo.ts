export type TodoStatus = 'Todo' | 'In Progress' | 'Done'

export type Todo = {
  id: string
  text: string
  status: TodoStatus
}
