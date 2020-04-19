

const socket=io()

//Elements
const $messageForm= document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $sendLocationButton = document.querySelector('#send-location')

const $messages=document.querySelector('#messages')
//Template
const messageTemplate= document.querySelector('#message-template').innerHTML
const locationMessageTemplate =document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
//options
const { username,room}=Qs.parse(location.search, {ignoreQueryPrefix:true})


const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('messageFunc',(val)=>{
    console.log(val)
    const html=Mustache.render(messageTemplate,{
      username:val.username,  
      message:val.text, 
      createdAt:moment(val.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationFunc',(val)=>{
    console.log(val)
    const html=Mustache.render(locationMessageTemplate, {
        username:val.username,
        url:val.url,
        createdAt:moment(val.createdAt).format('h:mm: a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room, users})=>{

  //  console.log(room)
   // console.log(users)
//     console.log("hello")
   const html=Mustache.render(sidebarTemplate,{
       room,
       users
   })
   
   document.querySelector('#sidebar').innerHTML=html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    
    $messageFormButton.setAttribute('disabled','disabled')

    const message=e.target.elements.message.value

    socket.emit('sendMessage',message,(val)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()

    
        if(val)
        {
        console.log(val)
        }
        else{
            console.log('Message deliverd')
        }
    })
})

$sendLocationButton.addEventListener('click',()=>{

   
    if(!navigator.geolocation)
    {  
        return alert('geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            lat:position.coords.latitude,
            lon:position.coords.longitude
        },()=>
        {  
             $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join',{username, room},(error)=>{

    if(error){
        alert(error)
        location.href='/'
    }

})