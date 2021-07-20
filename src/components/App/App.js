import React, {useState, useRef, useEffect, createContext, useContext} from "react";
import styled from "styled-components";
import {setTodoApp, getTodoApp} from '../../utils';

const Root = styled.div`
  width: 800px;
  margin: 20px auto;
  // text-align: center;
  background: white;
  min-height: 400px;
  padding: 20px 0;
`;
const TodoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 5px;
  transition-duration: 0.2s;
  transition-property: background;
  & + & {
    margin-top: 15px;
  }
  &:hover {
    background: wheat;
  }
`;
const TodoContentWrapper = styled.div`
  font-size: 20px;
  ${props=>props.isDone && `
    text-decoration: line-through;
    color: #f44336;
  `}
`;
const TodoButtonWrapper = styled.div``;
const Button = styled.button`
  background-color: #008CBA; /* Blue */
  border: none;
  border-radius: 3px;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 70px;
  & + & {
    margin-left: 10px;
  }
  ${props=>props.isDone && `
  background-color: rgba(0, 0, 0, 0.3);
  `}
`;
const DeleteButton = styled(Button)`
  background-color: #f44336;
`
const OutlineButton = styled(Button)`
  background-color: white;
  color: black;
  border: 1px solid #008CBA; 
  width: fit-content;
  transition-duration: 0.2s;
  &:hover {
    background-color: #008CBA;
    color: white;
  }
`;
const OutlineDeleteButton = styled(OutlineButton)`
  color: black;
  border: 1px solid #f44336; 
  &:hover {
    background-color: #f44336;
    color: white;
  }
`;
function TodoItem({todo, onDelete, onIsDone}){
  return (
    <TodoWrapper data-todo-id={todo.id}>
      <TodoContentWrapper isDone={todo.isDone}>
        {todo.content}
      </TodoContentWrapper>
      <TodoButtonWrapper>
        <Button isDone={todo.isDone} onClick={()=>{
          onIsDone(todo.id);
        }}>{todo.isDone ? "未完成" : "已完成"}</Button>
        <DeleteButton onClick={()=>{
          onDelete(todo.id);
        }}>刪除</DeleteButton>
      </TodoButtonWrapper>
    </TodoWrapper>
  )
}
const Header = styled.div`
  color: #008CBA;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  margin: 0 auto;
  width: fit-content;
`;
const TodoList = styled.div`
  width: 60%;
  margin: 0 auto;
  padding-bottom: 20px;
`;
const TodoForm = styled.div`
  margin: 20px auto;
  width: fit-content;
  display: flex;
  jsutify-content: center;
`;
const TodoFormInput = styled.input`
  padding: 5px 10px;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  margin-right: 20px;
  width: 250px;
  font-size: 18px;
`
const TodoFormHr = styled.hr`
  color: rgba(0, 0, 0, 0.65);
  width: 60%;
`
const FilterItem = styled.div`
  // border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;
  ${props=> props.$active && `
    border: 1px solid #f44336;
  `}
  &:hover {
    color: #f44336;
  }
`
const FilterWrapper = styled.div`
  margin: 15px auto;
  width: fit-content;
  display: flex;
  ${FilterItem} + ${FilterItem} {
    margin-left: 20px;
  }
`
const FilterContext = createContext(null);

function Filter({filter_name}){
  const {filter, setFilter} = useContext(FilterContext)
  return(
    <FilterItem 
      $active={filter_name === filter}
      onClick={()=>{
        setFilter(filter_name)
      }}
    >{filter_name}</FilterItem>
  )
} 

function App() {
  const id = useRef(1);
  const [value, setValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [todoList, setTodoList] = useState(()=>{
    let lastTodoApp = JSON.parse(getTodoApp());
    if(lastTodoApp.length > 0){
      id.current = lastTodoApp[0].id + 1;
    }
    else{
      lastTodoApp = []
    }
    return lastTodoApp
  });
  useEffect(()=>{
    setTodoApp(todoList);
  }, [todoList])
  useEffect(()=>{
  },[filter])
  const handleTodoChange = (e) => {
    setValue(e.target.value);
  }
  const handleAddTodo = (e) =>{
    // e.preventDefault();
    if(value){
      setTodoList([{
      id: id.current,
      content: value,
      isDone: false
      },...todoList]);
      setValue('');
      id.current++;
    }
    else{
      alert('todo is empty')
    }
  }
  const handleDeleteTodo = (id)=>{
    setTodoList(todoList.filter(todo=> todo.id !== id))
  }
  const handleTodoIsDone = (id)=>{
    setTodoList(todoList.filter(todo=>{
      if(todo.id === id){
        todo.isDone = !todo.isDone;
      }
      return todo;
    }))
  }
  const handleDeleteAllTodo = ()=>{
    setTodoList([]);
    id.current = 1;
  }
  const filterTodoList = ()=>{
    if(filter === 'completed'){
      return todoList.filter(todo=>todo.isDone !== true)
    }
    else if(filter === 'uncompleted'){
      return todoList.filter(todo=>todo.isDone === true)
    }
    else{
      return todoList
    }
  }
  return (
    <Root>
      <div>
        <Header>Todo-List</Header>
        <TodoForm>
          {/* <div> */}
            <TodoFormInput 
              type='text'
              value={value}
              placeholder='new todo...'
              onChange={handleTodoChange}
            />
            <OutlineButton onClick={handleAddTodo}>
              Add Todo
            </OutlineButton>
            <OutlineDeleteButton onClick={handleDeleteAllTodo}>
              Delete All
            </OutlineDeleteButton>
          {/* /div>< */}
        </TodoForm>
        <FilterWrapper>
          <FilterContext.Provider value={{filter, setFilter}}>
            <Filter filter_name="all" />
            <Filter filter_name="completed" />
            <Filter filter_name="uncompleted" />
          </FilterContext.Provider>
        </FilterWrapper>
        <TodoFormHr />
        <TodoList>
          {
            todoList && filterTodoList().map(todo=><TodoItem 
              key={todo.id}
              todo={todo}
              onDelete={handleDeleteTodo}
              onIsDone={handleTodoIsDone}
            />)
          }{
            !todoList.length && <div>Data Is Not Exist.</div>
          }
        </TodoList>
      </div>
    </Root>
  );
}

export default App;