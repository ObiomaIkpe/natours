

const login = async(email, password) => {
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
    alert('logged in successfully');
    window.setTimeout(() => {
      location.assign('/')
    }, 1500)
  }
}
    catch(err){
      //console.log(err.response)
      alert(err.response.data.message)
    } 
}


document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password)
})