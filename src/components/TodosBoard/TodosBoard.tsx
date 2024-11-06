import { useState } from 'react'

import { useTodosReducer } from '../../stores/Todos'
import { Todo, TodoStatus } from '../../types/Todo'
import { ItemsCard } from '../ItemsCard'

import PlusIcon from '../icons/PlusIcon'
import './TodosBoard.css'

export function TodosBoard() {
  const { state, dispatch } = useTodosReducer()
  const [newTodo, setNewTodo] = useState('')

  const handleMoveItem = (todo: Todo, status: TodoStatus) => {
    dispatch({ type: 'CHANGE_STATUS', payload: { id: todo.id, status } })
  }

  const handleAddTodo = () => {
    dispatch({ type: 'ADD', payload: newTodo })
    setNewTodo('')
  }

  return (
    <div className="todos-board">
      <div className="board-items">
        <ItemsCard
          title="To Do"
          items={state['Todo']}
          onMoveRight={(item) => handleMoveItem(item, 'In Progress')}
        />
        <ItemsCard
          title="In Progress"
          items={state['In Progress']}
          onMoveLeft={(item) => handleMoveItem(item, 'Todo')}
          onMoveRight={(item) => handleMoveItem(item, 'Done')}
        />
        <ItemsCard
          title="Done"
          items={state['Done']}
          onMoveLeft={(item) => handleMoveItem(item, 'In Progress')}
        />
      </div>
      <div className="add-task">
        <input
          type="text"
          placeholder="Add Task"
          aria-label="Add Task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          aria-label="Add Task"
          title="Add Task"
          onClick={handleAddTodo}
          disabled={!newTodo}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  )
}
