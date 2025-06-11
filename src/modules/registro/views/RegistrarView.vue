<template>
    <body>

    
    <div class="principal">
        <div class="titulo">
            <h2>Registrate<br>
                <span class="aca">acá!</span></h2>
        </div>
        
        <Form :validation-schema="schema" @submit="onSubmit">
            <div class="form">
                <label for="nombre">Nombre:</label>
                <Field type="text" name="nombre" id="nombre" placeholder="Ingrese su nombre" />
                <ErrorMessage name="nombre"></ErrorMessage>
            </div>
            <div class="form">
                <label for="correo">Correo:</label>
                <Field type="email" name="email" id="correo" placeholder="Ingrese su email" />
                <ErrorMessage name="email"></ErrorMessage>
            </div>
            <div class="form">
                <button type="submit">Registrar</button>
            </div>
        </Form>
    </div>

    </body>
</template>

<script setup>
import { Form, Field, ErrorMessage} from 'vee-validate';
import {schema} from '../schemas/validationSchema';

const onSubmit = () => {
    console.log('Se envio el formulario');
}
</script>

<style scoped>

body {
    
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif ;
}
.aca {
    padding-right: 80px;

}
.titulo {
    box-shadow: 3px 5px gray;
    border-radius: 10px 15px 50px;
    width: 60%;
    background-color: rgb(22, 132, 223);
    
}
input {
    margin-left: 10px;
    margin-right: 10px;
    border: 1px solid rgb(22, 22, 22);
    padding: 10px;
    border-radius: 12px;
}
label {
    color: #2c3e50;
    font-weight: 500;
    margin: 10px;
    font-size: 20px;
}
h2 {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    text-align: center;
    font-size: 30px;
}
.principal {
   
    justify-content: center;
    background-color: #F4F6F9;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    padding: 20px 30px;
    border-radius: 15px;
    border: 2px solid rgb(9, 64, 109);    
    margin-left: 70%;
    margin-top: 160px;
}
.form {
    
    margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  border-radius: 8px;
}

button {
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #0056b3;
  color: white;
}


</style>