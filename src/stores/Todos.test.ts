import { act, renderHook } from '@testing-library/react-hooks'
import { useTodosReducer } from './Todos'

describe('useTodosReducer', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useTodosReducer())
    expect(result.current.state.todos).toEqual([])
  })

  test('adds todos', async () => {
    const { result } = renderHook(() => useTodosReducer())
    const todoText = 'New Todo'
    const todoText2 = 'New Todo 2'

    act(() => {
      result.current.dispatch({ type: 'ADD', payload: todoText })
      result.current.dispatch({ type: 'ADD', payload: todoText2 })
    })

    expect(result.current.state.todos).toHaveLength(2)
    expect(result.current.state.todos[0].text).toBe(todoText)
    expect(result.current.state.todos[0].status).toBe('Todo')
    expect(result.current.state.todos[1].text).toBe(todoText2)
    expect(result.current.state.todos[1].status).toBe('Todo')
  })

  test('changes todos status', async () => {
    const { result } = renderHook(() => useTodosReducer())

    act(() => {
      result.current.dispatch({ type: 'ADD', payload: 'New Todo' })
      result.current.dispatch({ type: 'ADD', payload: 'New Todo 2' })
    })

    const todoId = result.current.state.todos[0].id

    act(() => {
      result.current.dispatch({
        type: 'CHANGE_STATUS',
        payload: { id: todoId, status: 'In Progress' },
      })
    })

    expect(result.current.state.todos[0].status).toBe('In Progress')
    expect(result.current.state.todos[1].status).toBe('Todo')
  })

  test('removes a todo', async () => {
    const { result } = renderHook(() => useTodosReducer())

    act(() => {
      result.current.dispatch({ type: 'ADD', payload: 'New Todo' })
      result.current.dispatch({ type: 'ADD', payload: 'New Todo 2' })
    })

    const todoId = result.current.state.todos[0].id

    act(() => {
      result.current.dispatch({ type: 'REMOVE', payload: { id: todoId } })
    })

    expect(result.current.state.todos).toHaveLength(1)
  })
})
