const path=require('path')
const http=require('http')
const express= require('express')
const socketio=require('socket.io')
const Qs=require('querystring')
const { generateMessage ,generateLocation}=require('./utils/message')
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const Filter=require('bad-words')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

const port=process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,'../public')
//let count=0
app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('New WebSocket connection')

   socket.on('join',({username,room},callback)=>
   {
     const {error,user} =addUser({id:socket.id,username,room})

     if(error)
     {
        return callback(error)
     }
    socket.join(user.room)



    socket.emit('messageFunc',generateMessage( 'Admin','Welcome'))
    socket.broadcast.to(user.room).emit('messageFunc',generateMessage('Admin',`${user.username} has joined`))
    
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
    callback()
    })

    socket.on('sendMessage',(message,callback)=>{

        const filter=new Filter()

        if(filter.isProfane(message))
        {
            return callback('Profinity not allowed')
        }

        const user=getUser(socket.id)
      
        io.to(user.room).emit('messageFunc',generateMessage(user.username,message))
        callback()
    })

    socket.on('disconnect',()=>{

        const user=removeUser(socket.id)

        if(user)
        {
            io.to(user.room).emit('messageFunc',generateMessage('Admin',`${user.username} has left`))

           // console.log(getUsersInRoom(user.room))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getUsersInRoom(user.room)

            })
        }
        console.log('hello')

    })

    socket.on('sendLocation',(cord,callback)=>{

        const user=getUser(socket.id)
        io.to(user.room).emit('locationFunc',generateLocation(user.username,`https://google.com/maps?=${cord.lat},${cord.lon}`))
        callback()

    })

})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})


