import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Todo } from '../../types/Todo'
import { ItemsCard, ItemsCardProps } from './ItemsCard'

describe('<ItemsCard />', () => {
  const makeSut = (props: Partial<ItemsCardProps> = {}) => {
    const defaultProps: ItemsCardProps = {
      title: 'Test Title',
      items: [{ id: '1', text: 'Item 1', status: 'Todo' }],
      onMoveLeft: jest.fn(),
      onMoveRight: jest.fn(),
    }
    const user = userEvent.setup()

    render(<ItemsCard {...defaultProps} {...props} />)

    return { user, ...defaultProps, ...props }
  }

  test('renders the title and the items', () => {
    const items: Todo[] = [
      { id: '1', text: 'Item 1', status: 'Todo' },
      { id: '2', text: 'Item 2', status: 'Todo' },
    ]
    makeSut({ title: 'My Todo List', items })

    expect(screen.getByText('My Todo List')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  test('calls onMoveLeft when left button is clicked', async () => {
    const { user, items, onMoveLeft } = makeSut()
    const leftButton = screen.getByTitle('Move Item to the Left')

    await user.click(leftButton)

    expect(onMoveLeft).toHaveBeenCalledWith(items[0])
  })

  test('calls onMoveRight when right button is clicked', async () => {
    const { user, items, onMoveRight } = makeSut()
    const rightButton = screen.getByTitle('Move Item to the Right')

    await user.click(rightButton)

    expect(onMoveRight).toHaveBeenCalledWith(items[0])
  })

  test('disables left button when onMoveLeft is not provided', () => {
    makeSut({ onMoveLeft: undefined })
    const leftButton = screen.getByTitle('Move Item to the Left')

    expect(leftButton).toBeDisabled()
  })

  test('disables right button when onMoveRight is not provided', () => {
    makeSut({ onMoveRight: undefined })
    const rightButton = screen.getByTitle('Move Item to the Right')

    expect(rightButton).toBeDisabled()
  })
})
