const users =[]

// join the user to chat

function userJoin(id, username, room){
    const user ={
        id,
        username,
        room
    }
    users.push(user)
    return user
}

// get the current user in the chat room

function currentUser(id){
    return users.find(user => user.id ===id)
}

module.exports={
    userJoin, currentUser
};