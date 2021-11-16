import React from 'react';
import { render, screen } from '@testing-library/react';
import Todo from '../../Todos/Todo';

test('renders a not-done <Todo/>', () => {
  const todoData = { text: 'Hello todo!!', done: false };
  const doneInfo = 'This todo is done';
  const notDoneInfo = 'This todo is not done';

  render(
    <Todo todo={todoData} doneInfo={doneInfo} notDoneInfo={notDoneInfo} />,
  );
  const todoTextElement = screen.queryByText(/Hello todo!!/i);
  const todoDoneElement = screen.queryByText(/This todo is done/i);
  const todoNotDoneElement = screen.queryByText(/This todo is not done/i);

  expect(todoTextElement).toBeDefined();
  expect(todoNotDoneElement).toBeDefined();
  expect(todoDoneElement).toBeNull();
});

test('renders a done <Todo/>', () => {
  const todoData = { text: 'Hello todo v2!!', done: true };
  const doneInfo = 'This todo is done';
  const notDoneInfo = 'This todo is not done';

  render(
    <Todo todo={todoData} doneInfo={doneInfo} notDoneInfo={notDoneInfo} />,
  );
  const todoTextElement = screen.queryByText(/Hello todo v2!!/i);
  const todoDoneElement = screen.queryByText(/This todo is done/i);
  const todoNotDoneElement = screen.queryByText(/This todo is not done/i);

  expect(todoTextElement).toBeDefined();
  expect(todoDoneElement).toBeDefined();
  expect(todoNotDoneElement).toBeNull();
});
