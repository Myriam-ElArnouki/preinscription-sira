const form = document.getElementById('preinscriptionForm');
const formMessage = document.getElementById('formMessage');
const summaryContent = document.getElementById('summaryContent');

const fields = [
  { id: 'parentName', label: 'Nom du parent' },
  { id: 'parentFirstName', label: 'Prénom du parent' },
  { id: 'parentEmail', label: 'Adresse e-mail' },
  { id: 'phone', label: 'Téléphone' },
  { id: 'address', label: 'Adresse complète' },
  { id: 'childName', label: 'Prénom de l’enfant' },
  { id: 'childLastName', label: 'Nom de l’enfant' },
  { id: 'age', label: 'Âge' },
  { id: 'level', label: 'Niveau' },
  { id: 'message', label: 'Message complémentaire' }
];

function updateSummary() {
  const values = fields
    .map((field) => {
      const element = document.getElementById(field.id);
      return {
        label: field.label,
        value: element.value.trim()
      };
    })
    .filter((item) => item.value !== '');

  const staticInfo = {
    label: 'Format de formation',
    value: 'En ligne'
  };

  const allValues = [staticInfo, ...values];

  if (allValues.length === 0) {
    summaryContent.innerHTML = `<p class="summary-empty">Le récapitulatif apparaîtra ici au fur et à mesure.</p>`;
    return;
  }

  summaryContent.innerHTML = `
    <div class="summary-list">
      ${allValues.map((item) => `
        <div class="summary-item">
          <strong>${item.label}</strong>
          <span>${item.value}</span>
        </div>
      `).join('')}
    </div>
  `;
}

fields.forEach((field) => {
  const element = document.getElementById(field.id);
  if (element) {
    element.addEventListener('input', updateSummary);
    element.addEventListener('change', updateSummary);
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    formMessage.textContent = 'Merci de remplir correctement tous les champs obligatoires.';
    formMessage.style.color = '#b42318';
    return;
  }

  formMessage.textContent = 'Envoi en cours...';
  formMessage.style.color = '#1F2A44';

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      formMessage.textContent = 'Préinscription envoyée avec succès.';
      formMessage.style.color = '#1F2A44';
      form.reset();
      updateSummary();
    } else {
      formMessage.textContent = 'Une erreur est survenue. Merci de réessayer.';
      formMessage.style.color = '#b42318';
    }
  } catch (error) {
    formMessage.textContent = 'Une erreur est survenue. Vérifie ta connexion ou la configuration du formulaire.';
    formMessage.style.color = '#b42318';
    console.error(error);
  }
});

updateSummary();