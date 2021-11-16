import React from 'react';

const Todo = (props) => {
  const { todo, doneInfo, notDoneInfo } = props;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '70%',
        margin: 'auto',
      }}
    >
      <span>{todo.text}</span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  );
};

export default Todo;
