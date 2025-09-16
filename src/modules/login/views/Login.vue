<template>

    <div class="container" id="container" ref="container">
        <div class="form-container sign-up">
            <form>
                <h1>Create Account</h1>
                <div class="social-icons">
                    <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
                <span>or use your email for registeration</span>
                <input type="text" placeholder="Name">
                <input type="email" placeholder="Email">
                <input type="password" placeholder="Password">
                <button>Sign Up</button>
            </form>
        </div>
        <div class="form-container sign-in">
            <form>
                <h1>Sign In</h1>
                <div class="social-icons">
                    <a href="#" class="icon"><i class="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
                    <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
                <span>or use your email password</span>
                <input type="email" placeholder="Email">
                <input type="password" placeholder="Password">
                <a href="#">Forget Your Password?</a>
                <button>Sign In</button>
            </form>
        </div>
        <div class="toggle-container">
            <div class="toggle">
                <div class="toggle-panel toggle-left">
                    <h1>Welcome Back!</h1>
                    <p>Enter your personal details to use all of site features</p>
                    <button class="hidden" id="login" @click.prevent="removerBtn">Sign In</button>
                </div>
                <div class="toggle-panel toggle-right">
                    <h1>Hello, Friend!</h1>
                    <p>Register with your personal details to use all of site features</p>
                    <button class="hidden" id="register" @click.prevent="activarBtn">Sign Up</button>
                </div>
            </div>
        </div>
    </div>


</template>

<script setup>
import '@fortawesome/fontawesome-free/css/all.css'

    import { ref } from 'vue'

    const container = ref(null)


    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');


    const activarBtn = () => {
        container.value.classList.add('active');
    }
 /*registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});*/

    const removerBtn = () =>{
        container.value.classList.remove('active');
    }
/*
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});*/
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: linear-gradient(145deg, #0d2c45, #092536);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  background: #123a5a;
  color: #f0f4f8;
  border-radius: 24px;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  transition: box-shadow 0.3s ease;
  animation: fadeIn 0.6s ease;
}

/* Formularios */
.container form {
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px;
  height: 100%;
}

.container input {
  background-color: #c4d8ff;
  border: none;
  margin: 8px 0;
  padding: 12px 16px;
  font-size: 14px;
  border-radius: 12px;
  width: 100%;
  color: #0d2c45;
  outline: none;
  transition: box-shadow 0.3s ease;
}

.container input:focus {
  box-shadow: 0 0 10px #0f2844;
}

/* Botones */
.container button {
  background-color: #1e90ff;
  color: white;
  font-size: 13px;
  padding: 10px 40px;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.container button:hover {
  background-color: #0077dd;
  box-shadow: 0 0 15px #0077ddcc;
}

.container button.hidden {
  background-color: transparent;
  border: 1.5px solid #f0f4f8;
  color: #f0f4f8;
}

.container span {
  font-size: 12px;
  margin-bottom: 10px;
  color: #a8c0ff;
}

.container a {
  color: #a8c0ff;
  font-size: 13px;
  margin: 15px 0 10px;
  text-decoration: none;
}

/* Social */
.social-icons a {
  border: 1px solid #a8c0ff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  color: #a8c0ff;
  transition: background-color 0.3s;
}

.social-icons a:hover {
  background-color: #1e90ff22;
}

/* Panel animado */
.toggle {
  background: linear-gradient(145deg, #1e3a5a, #0d2c45);
  color: #f0f4f8;
  height: 100%;
  width: 200%;
  left: -100%;
  position: relative;
  transition: all 0.6s ease-in-out;
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  text-align: center;
}

.toggle-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  border-radius: 150px 0 0 100px;
  z-index: 1000;
}

.container.active .toggle {
  transform: translateX(50%);
}

.container.active .toggle-left {
  transform: translateX(0);
}

.container.active .toggle-right {
  transform: translateX(200%);
}

.sign-in {
  position: absolute;
  left: 0;
  width: 50%;
  height: 100%;
  z-index: 2;
  transition: all 0.6s ease-in-out;
}

.container.active .sign-in {
  transform: translateX(100%);
}

.sign-up {
  position: absolute;
  left: 0;
  width: 50%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  transition: all 0.6s ease-in-out;
}

.container.active .sign-up {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
