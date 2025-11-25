// form validation (CUIT, email)

function validarCUIT(cuit){
  // (ARG CUIT tiene 11 dígitos)
  if(!cuit) return false;
  const raw = (''+cuit).replace(/\D/g,''); // sacar no numéricos
  return raw.length === 11;
}

function validarEmail(email){
  if(!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

