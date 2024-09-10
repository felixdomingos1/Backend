import * as Yup from "yup";

const createUsuarioSession = Yup.object().shape({
  email: Yup.string().max(100, 'O Email não pode ter mais de 100 caracteres').email('E-mail inválido').required('Email é Obrigatório'),
  password: Yup.string().min(8, 'A Palavra Passe não pode ter menos de 8 caracteres').required('A palavra Passe é Obrigatória'),
});

export default createUsuarioSession;
