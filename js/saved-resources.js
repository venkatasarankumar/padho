/**
 * PADHO - Saved Resources Module (Student Bookmarks)
 */

document.addEventListener('DOMContentLoaded', async () => {
  const user = PadhoAuth.getCurrentUser();
  if (!user) {
    window.location.href = 'login.html?returnUrl=saved-resources.html';
    return;
  }

  const grid = document.getElementById('savedResourcesGrid');
  const countBadge = document.getElementById('savedCountBadge');
  if (!grid) return;

  async function renderSaved() {
    const list = await PadhoData.getSavedResources(user.uid);
    const exams = await PadhoData.getExaminations();

    if (countBadge) {
      countBadge.textContent = `${list.length} Saved Item${list.length === 1 ? '' : 's'}`;
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <img src="assets/illustrations/empty-state.svg" alt="No saved resources" class="empty-state-img">
          <h3 class="empty-state-title">No saved resources yet.</h3>
          <p class="empty-state-desc">You haven't bookmarked any educational materials yet. Browse the resource library and bookmark syllabus sheets, NCERT books, or notes to access them quickly here.</p>
          <a href="resources.html" class="btn btn-primary btn-sm">Explore Resource Library</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(res => {
      const exam = exams.find(e => e.examId === res.examinationId);
      const savedDate = res.savedAt ? new Date(res.savedAt).toLocaleDateString() : '';

      return `
        <div class="resource-card">
          <div class="resource-card-top">
            <span class="badge ${res.language === 'Telugu' ? 'badge-telugu' : 'badge-emerald'}">${res.language}</span>
            <span class="badge badge-neutral">${res.resourceType}</span>
          </div>

          <h3 class="resource-title">${res.title}</h3>

          <div class="resource-meta">
            <span>📚 ${exam ? exam.title : 'Competitive Exam'}</span>
            ${savedDate ? `<span>• Saved on ${savedDate}</span>` : ''}
          </div>

          <p class="card-desc">${res.description}</p>

          <div class="resource-actions">
            <a href="${res.externalUrl || res.storageUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Open Resource
            </a>

            <button type="button" class="btn btn-outline btn-sm remove-saved-btn" data-resource-id="${res.resourceId}" style="color:var(--danger); border-color:var(--border-color);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Remove
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Remove buttons handler
    grid.querySelectorAll('.remove-saved-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const resId = btn.getAttribute('data-resource-id');
        await PadhoData.toggleSaveResource(user.uid, resId);
        window.showToast("Resource removed from saved bookmarks.");
        renderSaved();
      });
    });
  }

  renderSaved();
});

