/* Formulário de contato: validação em tempo real e envio por WhatsApp */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const WHATSAPP = '34644947414';
  const status = form.querySelector('.form-status');

  const rules = {
    nombre: {
      test: (v) => v.trim().length >= 2,
      msg: 'Escribe tu nombre (mínimo 2 caracteres).'
    },
    email: {
      test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      msg: 'Introduce un e-mail válido, por ejemplo nombre@correo.com.'
    },
    telefono: {
      test: (v) => v.trim() === '' || /^[+\d\s()-]{7,20}$/.test(v.trim()),
      msg: 'Revisa el teléfono. Usa solo números, espacios, +, guiones o paréntesis.'
    },
    mensaje: {
      test: (v) => v.trim().length >= 10,
      msg: 'Cuéntanos un poco más (mínimo 10 caracteres).'
    }
  };

  function check(name) {
    const field = form.elements[name];
    const wrap = field.closest('.field');
    const ok = rules[name].test(field.value);
    wrap.classList.toggle('is-invalid', !ok);
    field.setAttribute('aria-invalid', String(!ok));
    wrap.querySelector('.error').textContent = ok ? '' : rules[name].msg;
    return ok;
  }

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener('blur', () => { if (field.value) check(name); });
    field.addEventListener('input', () => {
      if (field.closest('.field').classList.contains('is-invalid')) check(name);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map(check);
    if (results.includes(false)) {
      form.querySelector('.is-invalid input, .is-invalid textarea').focus();
      status.textContent = 'Revisa los campos marcados antes de enviar.';
      return;
    }

    const nombre = form.elements.nombre.value.trim();
    const email = form.elements.email.value.trim();
    const telefono = form.elements.telefono.value.trim();
    const mensaje = form.elements.mensaje.value.trim();

    const text = `Hola Luz, soy ${nombre}.\n\n${mensaje}\n\nE-mail: ${email}` +
      (telefono ? `\nTeléfono: ${telefono}` : '');

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    status.textContent = 'Abrimos WhatsApp con tu mensaje listo para enviar.';
    form.reset();
  });
})();
