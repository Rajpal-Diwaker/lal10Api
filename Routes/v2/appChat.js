const Users = require('../../models/users')
const util = require("../../Utilities/util")
const Chat=require('../../models/Chat')

const knex = require('../../db/knex')
const { result } = require('underscore')

const sendChatMessage = async (data, callback) => {        
    let EnqId   = data.EnqId;
    let fromId  = data.fromId;
    let toId    = data.toId;
    let message = data.msg;
    let files    = data.files;
    let type    = data.type;
    
    if (!files){
        var user = await Chat.query().insert({ EnqId, fromId, toId, message, type})
    }else{
        var user = await Chat.query().insert({ EnqId, fromId, toId, message, files, type})                        
    }

    callback(null, user);
}

const getSenderDetails = async (data) => {    

    let userId  = data.fromId;
    
    try {

        const res = await Users.query()
                          .alias('u')
                          .leftOuterJoin('artisan_details as ad','u.id','userId')
                          .select('u.id as userId','u.email','u.mobile','ad.artisanImage','ad.state','ad.name')                          
                          .where('u.id','=',userId)
                          .where('u.isActive', '=',1)                              
        
            return util.nullRemove(res)
    } catch (e) {              
       return Promise.reject(e.toString())
    }
}

const getRecieverDetails = async (data) => {    
    let userId  = data.toId;
    try {

        const res = await Users.query()
                          .alias('u')
                          .leftOuterJoin('artisan_details as ad','u.id','userId')
                          .select('u.id as userId','u.email','u.mobile','ad.artisanImage','ad.state','ad.name')                          
                          .where('u.id','=',userId)
                          .where('u.isActive', '=',1)                                  
        
            return util.nullRemove(res)

    } catch (e) {              
       return Promise.reject(e.toString())
    }
}

const getchatData = async (data) => {    
    return new Promise((resolve, reject) => {
        let query = `SELECT *,DATE_FORMAT(c.created_at, '%h:%i %p') as created_at,DATE_FORMAT(c.created_at, '%Y-%m-%d') AS created_at2,created_at as created_at3 FROM chat AS c WHERE c.isActive = 1 AND c.fromId = '${data.fromId}' ORDER BY id DESC limit 1`;		    
        knex.raw(query).then((res) => {                    
           let result=util.nullRemove(res[0]);            
            resolve(result[0])
        })
     })
    }


const getMessage = async (data) => {    
    let { EnqId,fromId,toId,limit,offset } = data   

    if (!limit) limit = 10
    if (!offset) offset = 0
    
    return new Promise((resolve, reject) => {
        //let query = `select * from () t1 order by id`;	

        let query = `SELECT id, EnqId, fromId, toId, message, files, price, isRead, type, 
        DATE_FORMAT(c.created_at, '%h:%i %p') as created_at,  
        DATE_FORMAT(c.created_at, '%Y-%m-%d') AS created_at2 
        FROM chat AS c 
        WHERE c.isActive = 1  and c.EnqId = '${EnqId}'
        AND ((c.toId = '${toId}' AND c.fromId = '${fromId}') or (c.toId = '${fromId}' AND c.fromId = '${toId}'))
        ORDER BY id asc limit ${limit} offset ${offset}` 

        knex.raw(query).then((res) => {    
            let arr = util.nullRemove(res[0]);       
            //console.log(res2, "resresresresresres2")

            let combine = [], newArr = []
            arr.forEach((ob, i) => {
                const { type, url } = ob
                
                if(i != arr.length-1 && (arr[i+1].type == type) && type == 'image'){
                    combine.push(url)
                    combine.push(arr[i+1].url)
                }else{
                    if(combine.length > 0){
                        arr[i]['files'] = combine.join(", ")
                        arr[i]['type'] = 'combine'
                        arr[i]['message'] = combine.length
                                
                        combine = []
                    }
                    newArr.push(arr[i])
                }
            })

            // let promiseArr=[];
            // let j=0, i=1;

            // for(j=0;j<res2.length;j++){     
            //     if(res2[j] && res2[j+1] && res2[j].type==='image' && res2[j+1].type==='image'&& res2[j].fromId===res2[j+1].fromId)
            //     {
            //         res2[j] = res2[j+1]   
            //         res2[j].message=(i+1);      
            //         res2[j].type='combine';   
            //         res2[j+1].files += ', ' + res2[j].files;                                                               

            //         i++;
            //     }else{
            //         i=1;
            //         promiseArr[j]=res2[j];                            
            //     }                            
            // }

            // for(j=0;j<res2.length;j++){     
            //     if(res2[j] && res2[j].type==='combine')
            //         delete res2[j];      
            // }                
            
            // var result = res2.filter(function (el) {
            //     return el != null;
            // });          
            
            resolve(newArr)
            }).catch((err) => reject(err));      
        })                  
    }
    
//     const getMessage = async (data) => {    

//         var { EnqId,fromId,toId,limit,offset } = data   

//         if (!limit) limit =10
//         if (!offset) offset =0

//         return new Promise((resolve, reject) => {
//             let query = `select * from (SELECT id,EnqId,fromId,toId,message,files,price,isRead,type,DATE_FORMAT(c.created_at, '%h:%i %p') as created_at,  
//             DATE_FORMAT(c.created_at, '%Y-%m-%d') AS created_at2 FROM chat AS c WHERE c.isActive = 1  and c.EnqId = '${EnqId}'
//             AND ((c.toId = '${toId}' AND c.fromId = '${fromId}') or (c.toId = '${fromId}' AND c.fromId = '${toId}'))
//             ORDER BY id desc limit ${limit} offset ${offset})t1 order by id`;	

//             knex.raw(query).then((res) => {                    
//                 result=util.nullRemove(res[0]);                       
//                 resolve(result)
//                 }).catch((err) => reject(err));      
//             })                  
// }    

const deliverdMessage = async (data) => {   
    const { fromId } = data          
    // isRead: 0, isRead: 1, isRead: 2
    await Chat.query().update({isRead:1}).where({ toId:fromId,isActive:1}).where({'isRead':'0'})
    return ;
}
    

const getdeliverdMessageToUserId = async (data) => {   
    const { fromId } = data           
    return new Promise((resolve, reject) => {
        let query = `select distinct fromId from chat where toId=${fromId}`;	        
        knex.raw(query).then((res) => {                    
            result=util.nullRemove(res[0]);                           
            resolve(result)
            }).catch((err) => reject(err));      
        })  
}

const readMessage = async (data) => {       
    const { EnqId,fromId,toId } = data           
    await Chat.query().update({isRead:2}).where({ EnqId: EnqId,fromId:fromId,toId:toId,isActive:1}).debug()    
    return ;
}

const readMessage2 = async (data) => {       
    const { EnqId,fromId,toId } = data           
    await Chat.query().update({isRead:1}).where({ EnqId: EnqId,fromId:fromId,toId:toId,isActive:1}).debug()    
    return ;
}


const checkEnquiryorOrder = async (data) => {   
    var { toId,EnqId } = data           
    return new Promise(async (resolve, reject) => {
        let query = `SELECT * FROM enquiry_order where isActive='1' and adminAssign='1' and assignUserId=${toId} and EnqId=${EnqId}`;	           

        const resp = await knex.raw(query)        

        let result = util.nullRemove(resp[0]);                           
        resolve(result.length)     
    })  
}

const getUnreadEnqCount = async (data,type) => {   
    var { toId,EnqId } = data           
    return new Promise((resolve, reject) => {
        let query,result;
        
        console.log("getUnreadEnqCount",type)

        // let query = `select count(id)as Total from chat where isRead in ('0','1') and isActive='1' and toId=${toId} and EnqId=${EnqId}`;	  

         if(type ==='order')
         {
            query=`SELECT COUNT(c2.id)AS Total  FROM chat  AS c2 WHERE c2.EnqId='${EnqId}' AND c2.isActive='1' AND isRead IN ('1','0')
            AND c2.toId= (SELECT assignUserId FROM enquiry_order WHERE isActive='1' AND EnqId='${EnqId}' AND adminAssign='1' AND assignUserId='${toId}')`;
            
         }else{

            query=`SELECT COUNT(c2.id)AS Total  FROM chat  AS c2 WHERE c2.EnqId='${EnqId}' AND c2.isActive='1' AND isRead IN ('1','0')
            AND c2.toId= (SELECT assignUserId FROM enquiry_order WHERE isActive='1' AND EnqId='${EnqId}' AND adminAssign='0' AND assignUserId='${toId}')`;
        
        }
        
        console.log("query==getUnreadEnqCount",query)     

        knex.raw(query).then((res) => {                    
            result=util.nullRemove(res[0]);                           
            resolve(result[0].Total)
            }).catch((err) => reject(err));      
        })  
}


const getUnreadCount = async (data,type) => {   
    var { toId } = data           
    return new Promise((resolve, reject) => {

        
        console.log("getUnreadCount_getUnreadCount",type)

        let query,result;

        if(type ==='order'){
            
            query = `SELECT COUNT(distinct c.EnqId)as Total FROM chat AS c JOIN enquiry_order AS eo ON c.EnqId=eo.EnqId  AND c.isActive='1'  
            AND eo.isActive='1' AND isRead IN ('1','0') AND adminAssign='1' AND orderAccept !='2'  AND assignUserId='${toId}' and  toId='${toId}'`;

        }else{

            query = `SELECT COUNT(distinct c.EnqId) as Total FROM chat AS c JOIN enquiry_order AS eo ON c.EnqId=eo.EnqId  AND c.isActive='1'  
            AND eo.isActive='1' AND isRead IN ('1','0') AND adminAssign='0' AND assignUserId='${toId}'AND toId='${toId}'`;

       }
        
        console.log("query==getUnreadCount",query)     
        knex.raw(query).then((res) => {                    
            result=util.nullRemove(res[0]);                           
            resolve(result[0].Total)
            }).catch((err) => reject(err));      
        })  

}

module.exports = {
    sendChatMessage,
    getSenderDetails,
    getRecieverDetails,
    getchatData,
   // getchatData2,
    getMessage,
    readMessage,
    readMessage2,
    deliverdMessage,
    getdeliverdMessageToUserId,
    getUnreadEnqCount,
    getUnreadCount,
    checkEnquiryorOrder
}