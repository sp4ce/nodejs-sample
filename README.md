nodejs-sample
=============

Small todo app with nodejs and angularjs

website: http://ancient-garden-9946.herokuapp.com/

## API

###User

 - GET : `/users`, return the list of existing username.

 response example:
 
        ["bapt", "roger"]
 
 - POST: `/user`, create a user.
 
 request example:

        { username: 'myUsername', 'password': 'myPassword'}
    
 response example:
 
        user.id or -1 in case of error
        
 - POST: `/auth`, authenticate a user, get an access token, the token never expires.
 
 request example:

        { username: 'myUsername', 'password': 'myPassword'}
       
 response example:
 
        { error: true, message: 'something wrong happenned' }
        { error: false, token: 'SUPER_SECRET_TOKEN'}
 
 - GET: `/token`, check the token authenticity.

 request example:
 
        /token?username=bapt&token=SUPER_SECRET_TOKEN

 response example:
 
        true or false

### Todo
 
This API  need authenticated user. So you have to put the token in the query every request `access_token=SUPER_SECRET_TOKEN`
 
 - GET: `/todos`: Get the list of existing todo task
 
 response example:

        {
          "error": false,
          "todos": [{
            "title": "Task 1",
            "description": "Description 1",
            "priority": "Low",
            "deadline": "2013-08-23T05:00:00.000Z",
            "done": 0,
            "id": 2,
            "createdAt": "2013-08-22T13:54:31.000Z",
            "updatedAt": "2013-08-22T13:54:31.000Z",
            "userId": 1
          },
          {
            "title": "Task 2",
            "description": "Description 2",
            "priority": "High",
            "deadline": "2013-08-24T05:00:00.000Z",
            "done": 0,
            "id": 3,
            "createdAt": "2013-08-22T13:54:45.000Z",
            "updatedAt": "2013-08-22T13:54:45.000Z",
            "userId": 1
          }]
        }

 - POST `/todo`: create a todo task
 
 request example:

        {
          "title": "Task 1",
          "description": "Description 1",
          "priority": "Low",
          "deadline": "2013-08-23T05:00:00.000Z",
          "done": 0,
        }
 
 response example:
 
        todo.id
 
 - DELETE `todo/:todo_id`: delete a todo
