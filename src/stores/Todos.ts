import { useReducer } from 'react'
import { v4 as uuid } from 'uuid'
import { Todo, TodoStatus } from '../types/Todo'

export type TodosState = { [key in TodoStatus]: Todo[] }

export type TodoAction =
  | { type: 'ADD'; payload: string }
  | { type: 'CHANGE_STATUS'; payload: Pick<Todo, 'id' | 'status'> }

const initialState: TodosState = { Todo: [], 'In Progress': [], Done: [] }

function getById(state: TodosState, id: string) {
  for (const status in state) {
    const todo = state[status as TodoStatus]?.find((todo) => todo.id === id)
    if (todo) return todo
  }
}

function addNewTodo(state: TodosState, text: string) {
  const newTodo: Todo = {
    id: uuid(),
    text,
    status: 'Todo',
  }
  return {
    ...state,
    Todo: [...state.Todo, newTodo],
  }
}

function changeTodoStatus(
  state: TodosState,
  { id, status }: Pick<Todo, 'id' | 'status'>
) {
  const oldTodo = getById(state, id)
  if (!oldTodo) return state

  return {
    ...state,
    [oldTodo.status]: state[oldTodo.status].filter((todo) => todo.id !== id),
    [status]: [...state[status], { ...oldTodo, status: status }],
  }
}

const reducer = (
  state: TodosState,
  { type, payload }: TodoAction
): TodosState => {
  switch (type) {
    case 'ADD':
      return addNewTodo(state, payload)
    case 'CHANGE_STATUS':
      return changeTodoStatus(state, payload)
    default:
      return state
  }
}

export function useTodosReducer() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
