/**
 * PADHO - Educational Resources Library Module
 * 
 * Supports search, multi-filter (Exam, Subject, Language, Type),
 * resource details modal, and student bookmarking.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('resourcesGrid');
  if (!container) return;

  const searchInput = document.getElementById('resourceSearch');
  const examFilter = document.getElementById('filterExam');
  const subjectFilter = document.getElementById('filterSubject');
  const languageFilter = document.getElementById('filterLanguage');
  const typeFilter = document.getElementById('filterType');
  const resultsCount = document.getElementById('resourcesCount');

  // Parse URL query params (e.g. ?exam=jee-main&lang=Telugu)
  const urlParams = new URLSearchParams(window.location.search);
  const initialExam = urlParams.get('exam') || 'all';
  const initialLang = urlParams.get('lang') || 'all';
  const initialType = urlParams.get('type') || 'all';

  // Populate dynamic select options
  const exams = await PadhoData.getExaminations();
  const subjects = await PadhoData.getSubjects();

  if (examFilter) {
    exams.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.examId;
      opt.textContent = e.title;
      if (e.examId === initialExam) opt.selected = true;
      examFilter.appendChild(opt);
    });
  }

  if (subjectFilter) {
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.subjectId;
      opt.textContent = s.name;
      subjectFilter.appendChild(opt);
    });
  }

  if (languageFilter && initialLang !== 'all') {
    languageFilter.value = initialLang;
  }
  if (typeFilter && initialType !== 'all') {
    typeFilter.value = initialType;
  }

  // Render resources based on active filters
  async function loadResources() {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center;">
        <span class="spinner spinner-dark"></span>
        <p style="margin-top: 12px; color: var(--text-secondary);">Loading verified resources...</p>
      </div>
    `;

    const filters = {
      query: searchInput ? searchInput.value : '',
      examinationId: examFilter ? examFilter.value : 'all',
      subjectId: subjectFilter ? subjectFilter.value : 'all',
      language: languageFilter ? languageFilter.value : 'all',
      resourceType: typeFilter ? typeFilter.value : 'all'
    };

    const user = PadhoAuth.getCurrentUser();
    const resources = await PadhoData.getResources(filters);

    if (resultsCount) {
      resultsCount.textContent = `${resources.length} verified educational resource${resources.length === 1 ? '' : 's'} available`;
    }

    if (resources.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <img src="assets/illustrations/empty-state.svg" alt="No resources" class="empty-state-img">
          <h3 class="empty-state-title">No educational resources available yet.</h3>
          <p class="empty-state-desc">Try clearing your filters or search keywords to view all verified study materials.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="resetFiltersBtn">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (examFilter) examFilter.value = 'all';
          if (subjectFilter) subjectFilter.value = 'all';
          if (languageFilter) languageFilter.value = 'all';
          if (typeFilter) typeFilter.value = 'all';
          loadResources();
        });
      }
      return;
    }

    // Check saved state for each resource if user is authenticated
    const savedIds = new Set();
    if (user) {
      const savedList = await PadhoData.getSavedResources(user.uid);
      savedList.forEach(r => savedIds.add(r.resourceId));
    }

    container.innerHTML = resources.map(res => {
      const isSaved = savedIds.has(res.resourceId);
      const examObj = exams.find(e => e.examId === res.examinationId);
      const subjObj = subjects.find(s => s.subjectId === res.subjectId);

      return `
        <div class="resource-card">
          <div class="resource-card-top">
            <span class="badge ${res.language === 'Telugu' ? 'badge-telugu' : 'badge-emerald'}">
              ${res.language}
            </span>
            <span class="badge badge-neutral">${res.resourceType}</span>
          </div>

          <h3 class="resource-title">${res.title}</h3>
          
          <div class="resource-meta">
            <span>📚 ${examObj ? examObj.title : 'General'}</span>
            <span>•</span>
            <span>${subjObj ? subjObj.name : 'General'}</span>
            <span>•</span>
            <span>${res.educationLevel || 'Class 12 / Inter'}</span>
          </div>

          <p class="card-desc">${res.description}</p>

          <div class="resource-actions">
            <a href="${res.externalUrl || res.storageUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Open Resource
            </a>

            <button type="button" class="save-btn ${isSaved ? 'saved' : ''}" data-resource-id="${res.resourceId}" title="${isSaved ? 'Remove Bookmark' : 'Save Resource'}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              <span>${isSaved ? 'Saved' : 'Bookmark'}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach bookmark handlers
    container.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const resId = btn.getAttribute('data-resource-id');
        const activeUser = PadhoAuth.getCurrentUser();
        if (!activeUser) {
          window.showToast("Please log in to save and bookmark educational resources.", "error");
          setTimeout(() => {
            window.location.href = 'login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
          }, 1400);
          return;
        }

        try {
          const nowSaved = await PadhoData.toggleSaveResource(activeUser.uid, resId);
          if (nowSaved) {
            btn.classList.add('saved');
            btn.querySelector('span').textContent = 'Saved';
            btn.querySelector('svg').setAttribute('fill', 'currentColor');
            window.showToast("Resource added to your saved collection.");
          } else {
            btn.classList.remove('saved');
            btn.querySelector('span').textContent = 'Bookmark';
            btn.querySelector('svg').setAttribute('fill', 'none');
            window.showToast("Resource removed from saved collection.");
          }
        } catch (err) {
          window.showToast(err.message, "error");
        }
      });
    });
  }

  // Filter change listeners
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(loadResources, 280);
    });
  }
  if (examFilter) examFilter.addEventListener('change', loadResources);
  if (subjectFilter) subjectFilter.addEventListener('change', loadResources);
  if (languageFilter) languageFilter.addEventListener('change', loadResources);
  if (typeFilter) typeFilter.addEventListener('change', loadResources);

  // Initial load
  loadResources();
});

