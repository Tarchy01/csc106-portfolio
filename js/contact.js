// Contact form validation: no empty fields, valid email, digits-only phone.
const form = document.getElementById('contact-form');
const fields = ['name', 'email', 'phone', 'message'];

function showError(id, msg) {
  document.getElementById(id + '-error').textContent = msg;
  document.getElementById(id).classList.toggle('invalid', msg !== '');
}

function validateField(id) {
  const value = document.getElementById(id).value.trim();
  if (value === '') { showError(id, 'This field cannot be empty.'); return false; }
  if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    showError(id, 'Enter a valid email, like name@example.com.'); return false;
  }
  if (id === 'phone' && !/^\d+$/.test(value)) {
    showError(id, 'Use digits only, with no spaces, dashes or + sign.'); return false;
  }
  showError(id, '');
  return true;
}

fields.forEach(id => document.getElementById(id).addEventListener('blur', () => validateField(id)));

form.addEventListener('submit', e => {
  e.preventDefault();
  const results = fields.map(validateField);   // validate every field so all errors show
  const success = document.getElementById('form-success');
  if (results.every(Boolean)) {
    const name = document.getElementById('name').value.trim();
    success.textContent = 'Thanks, ' + name + '. Your message is ready to send.';
    success.classList.remove('hidden');
    form.reset();
  } else {
    success.classList.add('hidden');
    document.querySelector('.invalid').focus();
  }
});
