import { useReducer } from 'react'
import { v4 as uuid } from 'uuid'
import { Todo } from '../types/Todo'

export type TodosState = {
  todos: Todo[]
}

export type TodoAction =
  | { type: 'ADD'; payload: string }
  | { type: 'CHANGE_STATUS'; payload: Pick<Todo, 'id' | 'status'> }
  | { type: 'REMOVE'; payload: Pick<Todo, 'id'> }

const initialState: TodosState = {
  todos: [],
}

const reducer = (state: TodosState, action: TodoAction): TodosState => {
  switch (action.type) {
    case 'ADD':
      const newTodo: Todo = {
        id: uuid(),
        text: action.payload,
        status: 'Todo',
      }
      return { ...state, todos: [...state.todos, newTodo] }
    case 'CHANGE_STATUS':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, status: action.payload.status }
            : todo
        ),
      }
    case 'REMOVE':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      }
    default:
      return state
  }
}

export function useTodosReducer() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
