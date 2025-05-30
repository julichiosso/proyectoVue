import * as yup from 'yup';

export const schema = yup.object({
    nombre: yup.string().required('este campo es obligatorio'),
    email: yup.string().email().required('escribi bien idiota')
});