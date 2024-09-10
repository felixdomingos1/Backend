import * as Yup from "yup";

const usuarioEsquema = Yup.object().shape({
  // image: Yup.object({
  //   fieldname: Yup.string().required(),
  //   originalname: Yup.string().required(),
  //   encoding: Yup.string().required(),
  //   mimetype: Yup.string().required(),
  //   destination: Yup.string().required(),
  //   filename: Yup.string().required(),
  //   path: Yup.string().required(),
  //   size: Yup.number().required(),
  // }).required(),
  name: Yup.string().max(100, 'O nome não pode ter mais de 100 caracteres').required('Nome é Obrigatório'),
  email: Yup.string().max(100, 'O Email não pode ter mais de 100 caracteres').email('E-mail inválido').required('Email é Obrigatório'),
  password: Yup.string().min(8, 'A Palavra Passe não pode ter menos de 8 caracteres').required('A palavra Passe é Obrigatória'),
  role: Yup.string().max(30, 'O cargo não pode ter mais de 30 caracteres').required('O Cargo é Obrigatório'),
  // balance: Yup.string().max(100).required(),
});

export default usuarioEsquema;
