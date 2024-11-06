import { Todo } from '../../types/Todo'
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon'
import { ArrowRightIcon } from '../icons/ArrowRightIcon'
import './ItemsCard.css'

export type ItemsCardProps = {
  title: string
  items: Todo[]
  onMoveLeft?: (item: Todo) => void
  onMoveRight?: (item: Todo) => void
}

export function ItemsCard({
  title,
  items,
  onMoveLeft,
  onMoveRight,
}: ItemsCardProps) {
  return (
    <div className="items-card">
      <h1>{title}</h1>
      {items.map((item) => (
        <div key={item.id} className="todo-item">
          <button
            title="Move Item to the Left"
            aria-label="Move Item to the Left"
            className="button-left"
            onClick={() => onMoveLeft?.(item)}
            disabled={!onMoveLeft}
          >
            <ArrowLeftIcon />
          </button>
          {item.text}
          <button
            title="Move Item to the Right"
            aria-label="Move Item to the Right"
            className="button-right"
            onClick={() => onMoveRight?.(item)}
            disabled={!onMoveRight}
          >
            <ArrowRightIcon />
          </button>
        </div>
      ))}
    </div>
  )
}
