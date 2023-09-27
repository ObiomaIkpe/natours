import axios from 'axios';
import {showAlert} from './alerts';



// export const updateData = async (name, email) => {
//     try{
//         const res = await axios({
//             method: 'PATCH',
//             url: 'http://localhost:9000/api/v1/users/updateMe',
//             data: {
//                 name,
//                 email
//             }
//         })
//         if(res.data){
//             showAlert('success', 'data updated succesfully');
//         }

//     } catch(err){
//         showAlert('error', err.response.data.message)
//     }
// }

export const updateSettings = async (data, type) => {
    try{
        const url = type === 'password' ? 'http://localhost:9000/api/v1/users/updateMyPassword' :
        'http://localhost:9000/api/v1/users/updateMe'

        const res = await axios({
            method: 'PATCH',
            url,
            data

        })
        if(res.data){
            showAlert('success', `${type.toUpperCase()} updated successfully! }`);
        }
    } catch(err){
        showAlert('error', err.response.data.message)
    }
}