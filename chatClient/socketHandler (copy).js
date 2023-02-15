io.on('connection', function (socket) {
  io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients);
  })

  socket.on('initChat', async function (data) 
  {
    
    console.log("Request_data,",data)
    console.log("socket_id Genrate,",socket.id)
    // userDAO.updateSocket({ s_id: data.s_id, r_id: data.r_id,chat_type:data.msg }, { socketId: socket.id },
    userDAO.updateSocket(data, { socketId: socket.id }, 
      (err, dbData) => 
      {
      if (err) 
      {
        console.log(err);
      }
    });
  });

  socket.on('getChatList', function (data) {

    userDAO.updateReadStatus(data, (err, dbData) => 
    {
      if (err) 
      {
        console.log(err);
      }
    });

    userDAO.getUserChatList(data, (err, dbData) => {
      if (err) 
      {
        io.sockets.to(socket.id).emit('error_callback', { "message": "error occur." });
      }
        let arr=[]
       for (let i=0;i<dbData.length;i++){
         
          let obj={}
          obj.chat_id=(dbData[i].chat_id==null)?"":(dbData[i].chat_id)
          obj.from_user_id=(dbData[i].from_user_id==null)?"":(dbData[i].from_user_id)
          obj.to_user_id=(dbData[i].to_user_id==null)?"":(dbData[i].to_user_id)
          obj.message=(dbData[i].message==null)?"":(dbData[i].message);
          obj.files=(dbData[i].files==null)?"":(dbData[i].files);
          obj.type=(dbData[i].type==null)?"":(dbData[i].type);
          obj.read_status=(dbData[i].read_status==null)?"":(dbData[i].read_status)
          obj.deleted=(dbData[i].deleted==null)?"":(dbData[i].deleted)
          obj.created_date=dbData[i].created_date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
          arr.push(obj);
       }

      // dbData.sort(function(a, b){
      //     var keyA = new Date(a.id),
      //         keyB = new Date(b.id);
      //     // Compare the 2 dates
      //     if(keyA < keyB) return -1;
      //     if(keyA > keyB) return 1;
      //     return 0;
      // });

      io.sockets.to(socket.id).emit('getChatList', { "result": arr });

    });
  });


   socket.on('disconnectVideo', function (data) {

    userDAO.getSocketId(data.user_id, (err, socketId) => {

    data.socket_id=socket.id; 

    var socketID1=socketId[0].socketId;

    var socketID2=socket.id;


    userDAO.updateVideoStatus(socketID1,socketID2, (err,dbData) => {

    var otherData={"status":"disconnect"}

     io.sockets.to(socketId[0].socketId).emit('connectionStatus', { "result": otherData });
     io.sockets.to(socket.id).emit('connectionStatus', { "result": otherData });

     })

    })

  })


  //   socket.on('disconnectChat', function (data) 
  //   {

  //   userDAO.getSocketId(data.user_id, (err, socketId) => {

  //   userDAO.updateChatStatus(socketId, (err,dbData) => {

  //   var otherData={
  //     "status":"disconnect"
  //   }


  //    })

  //   })

  // })


  socket.on('sendMessage', function (data) 
  {

    var send_count = 0;
    var receive_count = 0;

    // console.log("Request message data",data)
   
    userDAO.getSocketId(data.r_id, (err, r_socketId) => 
    {
     // console.log("Reciver socket data ",r_socketId)
   
     userDAO.sendChatMessage(data, async (err, dbData) => 
      {

        if (err) 
        {
          io.sockets.to(socket.id).emit('error_callback', { "message": "error occur." });
        }       

      var userData = await getUserDetails(data); // reciver user data
      var sendData = await senderDetails(data);  // sender user data
      var getChatData = await getChatDetails(data); // last chat data
      
      // console.log('getChatData----------->',getChatData)

      if(getChatData)
      {
          getChatData.forEach(x=>{
            for (let [key, value] of Object.entries(x)) 
            {
                if(value == null)
                {
                  x[`${key}`]=''
                }
             }
          })
      }   

      // console.log('getChatData========',getChatData)
      getChatData[0]['created_date'] = moment().format('YYYY-MM-DD H:mm:ss');
      getChatData[0]['type'] = getChatData[0]['type'];

      if (r_socketId[0]['user_id']==getChatData[0]['to_user_id']) 
      {
               
          if (r_socketId[0].socket_id == userData['socket_id'])
          {

               if (r_socketId[0].socket_id)
                {

                  let senderData = {};
                  senderData.created_date =getChatData[0]['created_date']
                  senderData.chat_id = getChatData[0]['chat_id']
                  senderData.from_user_id = getChatData[0]['from_user_id']
                  senderData.to_user_id = getChatData[0]['to_user_id']
                  senderData.message = getChatData[0]['message']
                  senderData.files = getChatData[0]['files']
                  senderData.type = getChatData[0]['type']      
                  senderData.read_status = getChatData[0]['read_status']
                  senderData.deleted = getChatData[0]['deleted']

                  console.log("recieve---------------->",r_socketId[0].socket_id)
                  io.sockets.to(r_socketId[0].socket_id).emit('receiveMessage', { "result":senderData });
                  receive_count ++

                }
        
          }
      }

       if(r_socketId[0].online_status=='offline' || r_socketId[0].online_status=='')
        {
          
          // console.log("reciever is Offline")
          if(userData.device_type=='A')
          var device_type='1';
          else
          var device_type='0';
          var message = data.msg;
          var notiType='Chat';
          var title=sendData.first_name +' ' + sendData.last_name +' sent you a message'

        // notify.SENDER_DATA(notiType,userData.device_id,userData.web_id, device_type, title, message,userData,acc_type,data.r_id,data.s_id)
        notify.SENDER_DATA(notiType,userData.gcm_id,device_type,title,message,sendData,data.r_id,data.s_id)
        }

           // console.log("sender listening data ",getChatData[0])
            console.log("send=================>",socket.id)
            io.sockets.to(socket.id).emit('receiveMessage', { "result": getChatData[0] });
            send_count ++
            console.log("Sendcount --->",send_count,"ReceiveCount ---->",receive_count)


      })
    })
  })

   socket.on('save_current_participant', (data) => 
   {
    console.log('socket.id=================',socket.id)
    console.log('data=================',data)
        users.forEach((v, i) => 
        {
            if (v.socketId == data.socketId) 
            {
                const len = v.windowOpen.filter(obj => obj.socketId == data.socketId).length

                if (len == 0)
                    v.windowOpen.push({ socketId: data.socketId, currentParticipantUserId: data.currentParticipantUserId, flag: true })
                else 
                {
                    v.windowOpen.forEach(obj => 
                    {
                        if (obj.socketId == data.socketId) 
                        {
                            obj['flag'] = true
                            obj['currentParticipantUserId'] = data.currentParticipantUserId
                        }

                        else 
                        {
                            obj['flag'] = false
                            obj['currentParticipantUserId'] = data.currentParticipantUserId
                        }
                    })
                }
            }
        })

    })

  socket.on('deleteMsg', function (data) {

    userDAO.getSocketId(data.r_id, (err, r_socketId) => {

    var id=data.msg_id;

async.parallel({
  
  getcheckmsg:(cb)=>{
 if(data.delete_type=='1')
    {
        var delete_for_everyone='1';
        var deleted_by='';
        let temp={
         delete_for_everyone:'1',
         deleted_by:''
        }
        cb(null,temp)
    }
    else
    {
       userDAO.msgData(data, async (err, msgData) => {


        if(msgData.length>0)
        {
            var delete_for_everyone='0';
           var deleted_by=data.user_id;
           let temp={
             delete_for_everyone:'0',
           deleted_by:data.user_id
           }
           cb(null,temp)
        }
        else
        {
           var delete_for_everyone='1';
           var deleted_by=data.user_id;
          let temp={
             delete_for_everyone:'1',
         deleted_by:data.user_id
           }
           cb(null,temp)

        }


       });         
    }
  }


  },(err,response)=>{
console.log('======>>>',response)

userDAO.deleteMsg(response,id, async (err, dbData) => {

      console.log('----->DB Data',dbData);

          data.s_id=parseInt(data.s_id);
          data.r_id=parseInt(data.r_id);

        if(r_socketId[0].r_id==data.s_id)
        {
            io.sockets.to(r_socketId[0].socketId).emit('messageDelete', { "result": data });
           
            var readData={}
            readData.r_id=data.s_id; 
            readData.s_id=data.r_id;

        }
       
        io.sockets.to(socket.id).emit('messageDelete', { "result": data });

      })
  })
      
    })

  })

  socket.on('disconnect', function () {

    // console.log("disconnect==>>", socket.id)
    // console.log("==>>==>>==>>==>>==>>==>>disconnect==>>", data)
    userDAO.oflineUser(socket.id, (err, dbData) => {
      if (err) {
        console.log(err);
      }
    })
  });

});

app.post('/api/uploadMedia', function (req, res) {

  let form = new multiparty.Form({ maxFilesSize: 100 * 1024 * 1024 }); //setting max size of image to 10MB
  form.parse(req, (err, fields, files) => {
    if (err) { console.log("err", err); }
    else {
      cloudinary.v2.uploader.upload(files.Media[0].path, { resource_type: "auto" }, (err, result) => {
        if (err) return res.status(500).send({ message: 'Error' });
        let data = {
          s_id: fields.s_id,
          r_id: fields.r_id,
          msg_type: fields.msg_type,
          url: result.url,
          msg: fields.msg ? fields.msg : ''
        }

        let result_data = {
          url: data.url,
          msg: (data.msg)[0],
          msg_type: (data.msg_type)[0]
        }
        return res.send({ code: 200, message: "Uploaded Successfully.", result: result_data });
      })
    }
  })
})


app.post('/api/deleteChat', function (req, res) {

  let data = {
    msg_id: req.body.msg_id
  }
  userDAO.deleteChat(data, (err, result) => {

    if (err) res.send({ code: 500, message: "No message Found." })
  })
  return res.send({ code: 200, message: "Deleted Successfully." });


})

async function getUserDetails(data) {
  return new Promise((resolve, reject) => 
  {
    let query = 'SELECT * FROM `tbl_user` as `r`  WHERE `r`.`user_id`='+data.r_id
    dbConfig.getDB().query(query, (err3, dbData3) => {
      if (err3) {
        reject(err3);
      } else {
        resolve(dbData3[0])
      }
    })
  })
}


async function getchatData(data) {
  return new Promise((resolve, reject) => 
  {
    let query = "SELECT * FROM tbl_personal_chat WHERE ((from_user_id = " + data.s_id + " AND to_user_id = " + data.r_id +") or (to_user_id = " + data.s_id + " AND from_user_id = " + data.r_id +")) ORDER BY chat_id DESC ";
    dbConfig.getDB().query(query, (err3, dbData3) => 
    {
      if (err3) 
      {
        reject(err3);
      } 
      else 
      {
        resolve(dbData3)
      }

    })
    
  })
}

async function senderDetails(data) {
  return new Promise((resolve, reject) => {
    let url=cred['serverURLs']['localdev']['uploadFolder'];
    
    // let query = "SELECT r.*,(SELECT images FROM `tbl_user_image` WHERE created_by=r.user_id AND deleted='N' AND verify_pic='Y') ImageUrl FROM `tbl_user` as `r`  WHERE `r`.`user_id`=" + data.s_id
    let query = "SELECT r.*,concat('" + url + "',(SELECT images FROM `tbl_user_image` WHERE created_by=r.user_id AND deleted='N' AND verify_pic='Y')) ImageUrl FROM tbl_user as r  WHERE r.user_id='" + data.s_id +"'"

    dbConfig.getDB().query(query, (err3, dbData3) => {
      if (err3) {
        reject(err3);
      } else {
        resolve(dbData3[0])
      }
    })
  })
}


async function getChatDetails(data) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM `tbl_personal_chat` AS `r`  WHERE `r`.`from_user_id`='+data.s_id+'  ORDER BY chat_id DESC LIMIT 1'
    // console.log(query)
    dbConfig.getDB().query(query, (err3, userChatData) => {
      if (err3) {
        reject(err3);
      } else {
        resolve(userChatData)
      }
    })
    // console.log('userChatDatauserChatData=userChatData',userChatData)
  })
}

async function intUser(data) {
  return new Promise((resolve, reject) => {

     let user_id = `user_id = '${data.r_id}'`;
    let deleted_id = `deleted_id = '${data.s_id}'`;

    let query = `DELETE FROM chat_data WHERE  ${user_id} AND ${deleted_id}`

    dbConfig.getDB().query(query, (err3, dbData3) => {
      if (err3) {
        reject(err3);
      } else {
        resolve(dbData3[0])
      }
    })
  })
}
/* get socketId by userId */
var getSocketId = function (users, userId, type, callbackonline) {
    if (type == "group") {
        chatquery.seenBy({ doctor_to: userId, type: type }, (err, socketIds) => {
            if (err) {
                console.log(err);
            }
            var socketdata = [];
            var arrayIds = socketIds[0];
            for (let xuser of arrayIds.member_ids.split(',')) {
                for (let user of users) {
                    if (user.userId == xuser) {
                        socketdata.push({ userId: user.userId, socketId: user.socketId, status: user.status, windowOpen: user.windowOpen });

                    }
                }
            }
            callbackonline(socketdata);
        })
    } else {
        let socketdata;
        for (let user of users) {
            if (user.userId == userId) {
                socketdata = { userId: user.userId, socketId: user.socketId, status: user.status, windowOpen: user.windowOpen };

            }
        }
        callbackonline(socketdata);
    }
}

//
// initChat Request {"s_id":"2"}
// sendMessage Request {"s_id":"3","r_id":"2", "msg":"lest","files":"1573095501rd.png","type":"image,video,gif" }
// initChat
// sendMessage
// getChatList
// disconnectChat
// receiveMessage
// messageDelete