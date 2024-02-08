import React, { useState, createContext, useEffect, useCallback} from 'react';

import {env} from '../pages/const';
import axios from 'axios';
import { headers } from '../utils/common';
import { getInstanceByDom } from 'echarts';

export const NotificationContext  = createContext();

export const NotificationsProvider = props => {
   let [notificationData, setNotificationData] = useState ({
        length: 0,
        data: []
   });
   //const [name, setName] = useState("Parent Name");
    const [headersobj] = useState(headers());

    const  getNotifications  = useCallback(() => {
        
        axios.get(env.produrl+'/notifications/', { headers: headersobj })
        .then(res=>{
           const data = res.data.data;
           const filteredData = data.filter((item)=>{
            return item.readStatus === 'false'
           }); 
           console.log(data.length)
           setNotificationData({
               length: filteredData.length,
               data: data
           });
           
           // return res.data.data;
        }).catch((err) =>{
            console.log(err.message)
        });
    }, [headersobj]);

   
    useEffect(()=> {
        setInterval(()=>{
            getNotifications();
        }, 1*60*1000)
        
    }, [getNotifications])
    // console.log(notificationData.length)
    return (
        <NotificationContext.Provider value = { [notificationData, setNotificationData] }>
            { props.children}
        </NotificationContext.Provider>
    );
}

export default NotificationsProvider;