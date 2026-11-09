/**
 * PADHO - Student Dashboard Module
 * 
 * Strict compliance: Zero fabricated data, no fake percentages,
 * genuine database counts and student-centric saved resource access.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Guard route for authenticated students
  const user = PadhoAuth.getCurrentUser();
  if (!user) {
    window.location.href = 'login.html?returnUrl=dashboard.html';
    return;
  }

  // Set personalized greeting
  const greetingEl = document.getElementById('studentGreetingName');
  if (greetingEl) {
    greetingEl.textContent = user.name;
  }

  const userEmailEl = document.getElementById('studentUserEmail');
  if (userEmailEl) {
    userEmailEl.textContent = user.email;
  }

  const avatarInitial = document.getElementById('studentAvatarInitial');
  if (avatarInitial) {
    avatarInitial.textContent = (user.name || 'S').charAt(0).toUpperCase();
  }

  // Load genuine database metrics
  const exams = await PadhoData.getExaminations();
  const subjects = await PadhoData.getSubjects();
  const savedResources = await PadhoData.getSavedResources(user.uid);
  const allResources = await PadhoData.getResources({ publishedOnly: true });

  const countExamsEl = document.getElementById('countAvailableExams');
  if (countExamsEl) countExamsEl.textContent = exams.length;

  const countSubjectsEl = document.getElementById('countAvailableSubjects');
  if (countSubjectsEl) countSubjectsEl.textContent = subjects.length;

  const countSavedEl = document.getElementById('countSavedResources');
  if (countSavedEl) countSavedEl.textContent = savedResources.length;

  // Render Subject Navigation Pills
  const subjectPillsContainer = document.getElementById('dashboardSubjectPills');
  if (subjectPillsContainer) {
    subjectPillsContainer.innerHTML = subjects.map(s => `
      <a href="subject.html?subjectId=${s.subjectId}&examId=${s.examinationId}" class="subject-pill">
        <span>📖</span>
        <span>${s.name}</span>
      </a>
    `).join('');
  }

  // Render Recently Published Verified Resources
  const recentContainer = document.getElementById('dashboardRecentResources');
  if (recentContainer) {
    const recentItems = allResources.slice(0, 4);

    if (recentItems.length === 0) {
      recentContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p class="empty-state-desc">No educational resources available yet.</p>
        </div>
      `;
    } else {
      recentContainer.innerHTML = recentItems.map(res => {
        const exam = exams.find(e => e.examId === res.examinationId);
        return `
          <div class="resource-card">
            <div class="resource-card-top">
              <span class="badge ${res.language === 'Telugu' ? 'badge-telugu' : 'badge-emerald'}">${res.language}</span>
              <span class="badge badge-neutral">${res.resourceType}</span>
            </div>
            <h4 class="resource-title">${res.title}</h4>
            <div class="resource-meta">
              <span>🎯 ${exam ? exam.title : 'Competitive Exam'}</span>
            </div>
            <p class="card-desc" style="font-size:0.88rem;">${res.description}</p>
            <div class="resource-actions">
              <a href="${res.externalUrl || res.storageUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                Open Resource ↗
              </a>
              <a href="resources.html?exam=${res.examinationId}" class="btn btn-outline btn-sm">
                More in ${exam ? exam.title : 'Stream'}
              </a>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Logout listener
  const logoutBtn = document.getElementById('dashboardLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      PadhoAuth.logout();
    });
  }
});

