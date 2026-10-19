// ---- Configuration ----
// Local development: API on port 3000. After deploying, set API_BASE to your cloud URL,
// e.g. 'https://your-app.onrender.com'. If the frontend is served by the same Express
// server, an empty string ('') also works.
const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
const API = `${API_BASE}/api/recipes`;

const form = document.getElementById('recipeForm');
const body = document.getElementById('recipeBody');
const msg = document.getElementById('message');
const cancelBtn = document.getElementById('cancelBtn');
const fields = ['title', 'category', 'prep_time_minutes', 'servings', 'ingredients', 'instructions'];

function showMessage(text, ok = true) {
  msg.textContent = text;
  msg.className = ok ? 'ok' : 'err';
  setTimeout(() => (msg.className = ''), 3000);
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function request(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// READ – list all and render table
async function loadRecipes() {
  try {
    const recipes = await request(API);
    body.innerHTML = recipes.map((r) => `
      <tr>
        <td>${r.id}</td>
        <td><strong>${esc(r.title)}</strong></td>
        <td>${esc(r.category)}</td>
        <td>${esc(r.prep_time_minutes)}</td>
        <td>${esc(r.servings)}</td>
        <td>${esc(r.updated_at)}</td>
        <td>
          <button class="edit" onclick="startEdit(${r.id})">Edit</button>
          <button class="del" onclick="removeRecipe(${r.id})">Delete</button>
        </td>
      </tr>`).join('') || '<tr><td colspan="7">No recipes yet.</td></tr>';
  } catch (e) {
    showMessage('Could not load recipes: ' + e.message, false);
  }
}

// CREATE / UPDATE
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('recipeId').value;
  const payload = {};
  fields.forEach((f) => (payload[f] = document.getElementById(f).value));
  try {
    if (id) {
      await request(`${API}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showMessage('Recipe updated');
    } else {
      await request(API, { method: 'POST', body: JSON.stringify(payload) });
      showMessage('Recipe created');
    }
    resetForm();
    loadRecipes();
  } catch (err) {
    showMessage(err.message, false);
  }
});

// EDIT – load one record into the form
async function startEdit(id) {
  try {
    const r = await request(`${API}/${id}`);
    document.getElementById('recipeId').value = r.id;
    fields.forEach((f) => (document.getElementById(f).value = r[f] ?? ''));
    document.getElementById('formTitle').textContent = `Edit recipe #${r.id}`;
    document.getElementById('saveBtn').textContent = 'Update recipe';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    showMessage(err.message, false);
  }
}

// DELETE
async function removeRecipe(id) {
  if (!confirm('Delete this recipe?')) return;
  try {
    await request(`${API}/${id}`, { method: 'DELETE' });
    showMessage('Recipe deleted');
    loadRecipes();
  } catch (err) {
    showMessage(err.message, false);
  }
}

function resetForm() {
  form.reset();
  document.getElementById('recipeId').value = '';
  document.getElementById('formTitle').textContent = 'Add a new recipe';
  document.getElementById('saveBtn').textContent = 'Save recipe';
  cancelBtn.style.display = 'none';
}
cancelBtn.addEventListener('click', resetForm);

loadRecipes();
