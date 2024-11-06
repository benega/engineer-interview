import { act, renderHook } from '@testing-library/react-hooks'
import { useTodosReducer } from './Todos'

describe('useTodosReducer', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useTodosReducer())
    expect(result.current.state).toEqual({
      Todo: [],
      'In Progress': [],
      Done: [],
    })
  })

  test('adds todos', async () => {
    const { result } = renderHook(() => useTodosReducer())
    const todoText = 'New Todo'
    const todoText2 = 'New Todo 2'

    act(() => {
      result.current.dispatch({ type: 'ADD', payload: todoText })
      result.current.dispatch({ type: 'ADD', payload: todoText2 })
    })

    expect(result.current.state['Todo']).toHaveLength(2)
    expect(result.current.state['Todo'][0].text).toBe(todoText)
    expect(result.current.state['Todo'][0].status).toBe('Todo')
    expect(result.current.state['Todo'][1].text).toBe(todoText2)
    expect(result.current.state['Todo'][1].status).toBe('Todo')
  })

  test('changes todo status to In Progress', async () => {
    const { result } = renderHook(() => useTodosReducer())

    act(() => {
      result.current.dispatch({ type: 'ADD', payload: 'New Todo' })
      result.current.dispatch({ type: 'ADD', payload: 'New Todo 2' })
    })

    const todoId = result.current.state['Todo'][0].id

    act(() => {
      result.current.dispatch({
        type: 'CHANGE_STATUS',
        payload: { id: todoId, status: 'In Progress' },
      })
    })

    expect(result.current.state['In Progress'][0].status).toBe('In Progress')
    expect(result.current.state['Todo'][0].status).toBe('Todo')
  })

  test('changes todo status to Done', async () => {
    const { result } = renderHook(() => useTodosReducer())

    act(() => {
      result.current.dispatch({ type: 'ADD', payload: 'New Todo' })
      result.current.dispatch({ type: 'ADD', payload: 'New Todo 2' })
    })

    const todoId = result.current.state['Todo'][0].id

    act(() => {
      result.current.dispatch({
        type: 'CHANGE_STATUS',
        payload: { id: todoId, status: 'Done' },
      })
    })

    expect(result.current.state['Done'][0].status).toBe('Done')
    expect(result.current.state['Todo'][0].status).toBe('Todo')
  })
})
