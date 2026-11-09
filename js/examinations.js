/**
 * PADHO - Examinations Directory & Examination Details Module
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Check if we are on examination-details.html or examinations.html
  const isDetailsPage = document.getElementById('examDetailsContainer');
  const isListingPage = document.getElementById('examsGrid');

  if (isListingPage) {
    initExaminationsListing();
  }

  if (isDetailsPage) {
    initExaminationDetails();
  }
});

/**
 * 1. Examinations Directory Listing
 */
async function initExaminationsListing() {
  const grid = document.getElementById('examsGrid');
  const pills = document.querySelectorAll('.exam-filter-pill');
  if (!grid) return;

  const exams = await PadhoData.getExaminations();

  function renderExams(category = 'all') {
    let filtered = exams;
    if (category !== 'all') {
      filtered = exams.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <img src="assets/illustrations/empty-state.svg" alt="No examinations" class="empty-state-img">
          <h3 class="empty-state-title">No examinations found</h3>
          <p class="empty-state-desc">No examination details are currently listed under this category.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(exam => {
      // Determine category badge icon
      let iconFile = 'exam-engineering.svg';
      if (exam.category === 'SSC') iconFile = 'exam-ssc.svg';
      if (exam.category === 'Banking') iconFile = 'exam-banking.svg';
      if (exam.category === 'Railway') iconFile = 'exam-railway.svg';

      return `
        <div class="exam-card">
          <div class="exam-card-header">
            <div class="card-icon-wrap" style="margin-bottom:0; width:44px; height:44px;">
              <img src="assets/icons/${iconFile}" alt="${exam.category}" style="width:28px; height:28px;">
            </div>
            <span class="badge badge-emerald">${exam.category}</span>
          </div>

          <h3 class="exam-card-title">${exam.title}</h3>
          <p class="card-desc" style="font-size:0.9rem; line-height:1.5;">${exam.description}</p>

          <div class="exam-card-meta">
            <div><strong>Agency:</strong> ${exam.organizer || 'Official Board'}</div>
            <div><strong>Subjects:</strong> ${exam.subjects ? exam.subjects.join(', ') : 'Standard curriculum'}</div>
          </div>

          <div class="flex items-center justify-between" style="margin-top:auto; padding-top:12px;">
            <a href="examination-details.html?id=${exam.examId}" class="btn btn-outline btn-sm">
              View Syllabus & Details
            </a>
            <a href="${exam.officialWebsite}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Visit verified official portal">
              Official Portal ↗
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  // Filter pill events
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-category');
      renderExams(cat);
    });
  });

  renderExams('all');
}

/**
 * 2. Examination Detailed View
 */
async function initExaminationDetails() {
  const container = document.getElementById('examDetailsContainer');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get('id') || 'jee-main';

  const exam = await PadhoData.getExaminationById(examId);

  if (!exam) {
    container.innerHTML = `
      <div class="empty-state">
        <img src="assets/illustrations/empty-state.svg" alt="Not found" class="empty-state-img">
        <h3 class="empty-state-title">Examination Record Not Found</h3>
        <p class="empty-state-desc">The requested competitive examination details could not be found or have been updated.</p>
        <a href="examinations.html" class="btn btn-primary">Browse All Examinations</a>
      </div>
    `;
    return;
  }

  // Set document title
  document.title = `${exam.title} - Examination Details & Syllabus | PADHO`;

  // Fetch subjects related to this exam
  const subjects = await PadhoData.getSubjects(exam.examId);
  const resources = await PadhoData.getResources({ examinationId: exam.examId });

  container.innerHTML = `
    <!-- Header Banner -->
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:40px; margin-bottom:32px;">
      <div class="flex items-center gap-sm" style="margin-bottom:12px;">
        <span class="badge badge-emerald">${exam.category} Stream</span>
        <span class="badge badge-neutral">Conducting Body: ${exam.organizer || 'Official Authority'}</span>
      </div>
      <h1 style="font-size:2.5rem; margin-bottom:12px;">${exam.title}</h1>
      <p style="font-size:1.15rem; color:var(--text-secondary); max-width:840px; margin-bottom:24px;">
        ${exam.description}
      </p>

      <div class="flex flex-wrap items-center gap-md">
        <a href="${exam.officialWebsite}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Official Website (${new URL(exam.officialWebsite).hostname})
        </a>
        <a href="resources.html?exam=${exam.examId}" class="btn btn-secondary">
          Browse Study Materials (${resources.length})
        </a>
      </div>
    </div>

    <!-- Structured Examination Information -->
    <div class="grid-2" style="margin-bottom:36px;">
      <!-- Eligibility Criteria -->
      <div class="padho-card">
        <div class="flex items-center gap-sm" style="margin-bottom:14px;">
          <div class="card-icon-wrap" style="width:36px; height:36px; margin-bottom:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 style="font-size:1.3rem;">Eligibility Information</h3>
        </div>
        <p style="color:var(--text-main); font-size:0.98rem; line-height:1.6;">${exam.eligibility}</p>
      </div>

      <!-- Examination Pattern & Structure -->
      <div class="padho-card">
        <div class="flex items-center gap-sm" style="margin-bottom:14px;">
          <div class="card-icon-wrap" style="width:36px; height:36px; margin-bottom:0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <h3 style="font-size:1.3rem;">Examination Structure</h3>
        </div>
        <p style="color:var(--text-main); font-size:0.98rem; line-height:1.6;">${exam.examStructure}</p>
      </div>
    </div>

    <!-- Subjects and Syllabus Section -->
    <div style="margin-bottom:40px;">
      <h2 style="font-size:1.75rem; margin-bottom:20px;">Curriculum &amp; Subjects</h2>
      <div class="grid-3">
        ${subjects.map(s => `
          <div class="padho-card">
            <h4 style="margin-bottom:8px; font-size:1.15rem;">${s.name}</h4>
            <p style="font-size:0.9rem; margin-bottom:16px;">${s.description}</p>
            <a href="subject.html?subjectId=${s.subjectId}&examId=${exam.examId}" class="btn btn-outline btn-sm" style="margin-top:auto;">
              Explore Topics &amp; Notes →
            </a>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Verified Learning Materials for this exam -->
    <div style="margin-bottom:40px;">
      <div class="flex items-center justify-between" style="margin-bottom:20px;">
        <h2 style="font-size:1.75rem;">Verified Educational Resources</h2>
        <a href="resources.html?exam=${exam.examId}" class="btn btn-outline btn-sm">View All in Library →</a>
      </div>

      ${resources.length > 0 ? `
        <div class="grid-3">
          ${resources.slice(0, 3).map(res => `
            <div class="resource-card">
              <div class="resource-card-top">
                <span class="badge ${res.language === 'Telugu' ? 'badge-telugu' : 'badge-emerald'}">${res.language}</span>
                <span class="badge badge-neutral">${res.resourceType}</span>
              </div>
              <h4 class="resource-title">${res.title}</h4>
              <p class="card-desc" style="font-size:0.88rem;">${res.description}</p>
              <div class="resource-actions">
                <a href="${res.externalUrl || res.storageUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                  Access Resource ↗
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <p class="empty-state-desc">No educational resources available yet for this examination.</p>
        </div>
      `}
    </div>
  `;
}

