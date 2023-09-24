import axios from 'axios';
import { hideAlert, showAlert } from './alerts';

export const login = async(email, password) => {
  //alert(email, password)
  console.log(email, password)
try{
  const res = await axios({
    method: 'POST',
    url: 'http://localhost:9000/api/v1/users/login',
      data:{
        email,
        password
      }
  })
  console.log(res)
  if (res.data){
    showAlert('success','logged in successfully');
    window.setTimeout(() => {
      location.assign('/')
    }, 1500)
  }
}
    catch(err){
      //console.log(err.response)
      showAlert('failed', err.response.data.message)
    } 
}


