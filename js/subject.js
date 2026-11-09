/**
 * PADHO - Subject & Topic Explorer Module
 */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('subjectPageContainer');
  const breadcrumbName = document.getElementById('breadcrumbSubjectName');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const subjectId = urlParams.get('subjectId') || 'subj-phy';
  const examId = urlParams.get('examId') || 'jee-main';

  const subjects = await PadhoData.getSubjects();
  const subject = subjects.find(s => s.subjectId === subjectId) || subjects[0];
  const exam = await PadhoData.getExaminationById(subject ? subject.examinationId : examId);
  const topics = await PadhoData.getTopics(subject ? subject.subjectId : null);
  const resources = await PadhoData.getResources({ subjectId: subject ? subject.subjectId : null });

  if (breadcrumbName && subject) {
    breadcrumbName.textContent = subject.name;
  }

  if (!subject) {
    container.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state-title">Subject Not Found</h3>
        <p class="empty-state-desc">The requested subject is not available.</p>
        <a href="examinations.html" class="btn btn-primary">Browse Examinations</a>
      </div>
    `;
    return;
  }

  document.title = `${subject.name} — Curriculum, Topics & Resources | PADHO`;

  container.innerHTML = `
    <!-- Subject Banner -->
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:36px; margin-bottom:32px;">
      <div class="flex items-center gap-sm" style="margin-bottom:10px;">
        <span class="badge badge-emerald">${exam ? exam.title : 'Competitive Exam'}</span>
        <span class="badge badge-neutral">Curriculum Subject</span>
      </div>
      <h1 style="font-size:2.4rem; margin-bottom:12px;">${subject.name}</h1>
      <p style="font-size:1.05rem; color:var(--text-secondary); max-width:800px; margin-bottom:20px;">
        ${subject.description}
      </p>
      <div class="flex items-center gap-md">
        <a href="resources.html?subject=${subject.subjectId}" class="btn btn-primary btn-sm">
          View All ${subject.name} Resources (${resources.length})
        </a>
        ${exam ? `<a href="examination-details.html?id=${exam.examId}" class="btn btn-outline btn-sm">View Full ${exam.title} Details</a>` : ''}
      </div>
    </div>

    <!-- Topics List -->
    <div style="margin-bottom:40px;">
      <h2 style="font-size:1.6rem; margin-bottom:18px;">Structured Topics</h2>
      ${topics.length > 0 ? `
        <div class="grid-2">
          ${topics.map(t => `
            <div class="padho-card">
              <h4 style="margin-bottom:8px; font-size:1.15rem;">${t.title}</h4>
              <p style="font-size:0.92rem; color:var(--text-secondary); margin-bottom:14px;">${t.description}</p>
              <a href="resources.html?subject=${subject.subjectId}&query=${encodeURIComponent(t.title)}" class="btn btn-outline btn-sm" style="margin-top:auto;">
                Browse Topic Materials →
              </a>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <p class="empty-state-desc">No specific topic breakdowns listed yet for this subject.</p>
        </div>
      `}
    </div>

    <!-- Verified Learning Materials for this subject -->
    <div>
      <h2 style="font-size:1.6rem; margin-bottom:18px;">Available Study Materials (${resources.length})</h2>
      ${resources.length > 0 ? `
        <div class="grid-3">
          ${resources.map(res => `
            <div class="resource-card">
              <div class="resource-card-top">
                <span class="badge ${res.language === 'Telugu' ? 'badge-telugu' : 'badge-emerald'}">${res.language}</span>
                <span class="badge badge-neutral">${res.resourceType}</span>
              </div>
              <h4 class="resource-title">${res.title}</h4>
              <p class="card-desc" style="font-size:0.88rem;">${res.description}</p>
              <div class="resource-actions">
                <a href="${res.externalUrl || res.storageUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                  Open Resource ↗
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <p class="empty-state-desc">No educational resources available yet for this subject.</p>
        </div>
      `}
    </div>
  `;
});

