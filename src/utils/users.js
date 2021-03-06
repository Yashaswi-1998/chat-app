const users= []

const addUser = function({ id,username,room})
{
    //clean the data
    username= username.trim().toLowerCase()
    room =room.trim().toLowerCase()

    //validate the data
    if(!username||!room)
    {
        return{
            error:'Username and room are required'
        }
    }

    //check for existing user
    const existingUser =users.find((user)=>{
        return user.room===room &&user.username===username 
    })

    if(existingUser)
    {
        return{
            error:'Username is in use'
        }
    }


    const user={id, username, room}
    users.push(user)
    return {user:user}
}


const removeUser= (id) =>
{ 
    
    const index=users.findIndex((user)=>{
        return user.id===id
    })

    console.log(index)
    if(index!==-1)
    {
        console.log('ruuning')
        return users.splice(index,1)[0] 
    }
}

const getUser=(id)=>{
    return users.find((user)=>{
        return user.id===id
    })
}

const getUsersInRoom =(room)=>{
   return  users.filter((user) => user.room === room)
}



module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}   
//console.log(users)


