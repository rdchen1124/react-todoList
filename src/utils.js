const TODO_APP = 'todoApp';
export const setTodoApp = (todoApp) => {
    window.localStorage.setItem(TODO_APP, JSON.stringify(todoApp));
}
export const getTodoApp = () => {
    let data = window.localStorage.getItem(TODO_APP);
    if(data === null){
        data = '[]';
    }
    return data
}