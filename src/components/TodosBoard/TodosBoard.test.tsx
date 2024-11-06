import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { TodosState, useTodosReducer } from '../../stores/Todos'
import { Todo } from '../../types/Todo'
import { ItemsCardProps } from '../ItemsCard'
import { TodosBoard } from './TodosBoard'

jest.mock('../../stores/Todos', () => ({
  useTodosReducer: jest.fn(),
}))

const mockItemsCardTodo: Todo = {
  id: 'mock-item-todo',
  text: 'Test Todo',
  status: 'Todo',
}

jest.mock('../ItemsCard', () => ({
  ItemsCard: ({ title, onMoveLeft, onMoveRight }: ItemsCardProps) => {
    return (
      <div
        data-testid={`items-card-${title.replaceAll(' ', '').toLowerCase()}`}
      >
        <button
          data-testid="move-left"
          onClick={() => onMoveLeft?.(mockItemsCardTodo)}
        />
        <button
          data-testid="move-right"
          onClick={() => onMoveRight?.(mockItemsCardTodo)}
        />
      </div>
    )
  },
}))

const makeSut = () => {
  const user = userEvent.setup()

  render(<TodosBoard />)

  return { user }
}

describe('TodosBoard', () => {
  const mockDispatch = jest.fn()
  const mockState: TodosState = {
    Todo: [],
    'In Progress': [],
    Done: [],
  }

  beforeEach(() => {
    ;(useTodosReducer as jest.Mock).mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders the component', () => {
    makeSut()

    expect(screen.getByPlaceholderText('Add Task')).toBeInTheDocument()
    expect(screen.getByTitle('Add Task')).toBeInTheDocument()
  })

  test('adds a new todo', async () => {
    const { user } = makeSut()

    const input = screen.getByPlaceholderText('Add Task')
    const button = screen.getByRole('button', { name: 'Add Task' })

    await user.type(input, 'New Task')
    await user.click(button)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD',
      payload: 'New Task',
    })
    expect(input).toHaveValue('')
  })

  test('moves a todo item to In Progress', async () => {
    const { user } = makeSut()
    const itemsCard = within(screen.getByTestId('items-card-todo'))
    const moveRightButton = itemsCard.getByTestId('move-right')

    await user.click(moveRightButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CHANGE_STATUS',
      payload: { id: mockItemsCardTodo.id, status: 'In Progress' },
    })
  })

  test('moves back a todo item to Todo', async () => {
    const { user } = makeSut()
    const itemsCard = within(screen.getByTestId('items-card-inprogress'))
    const moveLeftButton = itemsCard.getByTestId('move-left')

    await user.click(moveLeftButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CHANGE_STATUS',
      payload: { id: mockItemsCardTodo.id, status: 'Todo' },
    })
  })

  test('moves a todo item to Done', async () => {
    const { user } = makeSut()
    const itemsCard = within(screen.getByTestId('items-card-inprogress'))
    const moveRightButton = itemsCard.getByTestId('move-right')

    await user.click(moveRightButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CHANGE_STATUS',
      payload: { id: mockItemsCardTodo.id, status: 'Done' },
    })
  })

  test('moves back a todo item to In Progress', async () => {
    const { user } = makeSut()
    const itemsCard = within(screen.getByTestId('items-card-done'))
    const moveLeftButton = itemsCard.getByTestId('move-left')

    await user.click(moveLeftButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CHANGE_STATUS',
      payload: { id: mockItemsCardTodo.id, status: 'In Progress' },
    })
  })

  test('does not allow moving back a todo item from Todo', async () => {
    const { user } = makeSut()
    const itemsCard = within(screen.getByTestId('items-card-todo'))
    const moveLeftButton = itemsCard.getByTestId('move-left')

    await user.click(moveLeftButton)

    expect(mockDispatch).not.toHaveBeenCalled()
  })

  test('does not allow moving a todo item from Done', async () => {
    const { user } = makeSut()
    const itemsCard = within(screen.getByTestId('items-card-done'))
    const moveRightButton = itemsCard.getByTestId('move-right')

    await user.click(moveRightButton)

    expect(mockDispatch).not.toHaveBeenCalled()
  })
})
