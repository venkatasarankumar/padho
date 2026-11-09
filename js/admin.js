/**
 * PADHO - Admin Management Controller
 * 
 * Secure route guard, resource CRUD, examinations manager,
 * subjects/topics management, message viewer, and Firebase diagnostics.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Strict Administrator Route Guard
  const user = PadhoAuth.getCurrentUser();
  if (!user || user.role !== 'admin') {
    alert("Access restricted. Please log in with an authorized Administrator account.");
    window.location.href = '../login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
    return;
  }

  // Display admin profile info in sidebar
  const adminNameEl = document.getElementById('adminSidebarName');
  if (adminNameEl) adminNameEl.textContent = user.name;
  const adminEmailEl = document.getElementById('adminSidebarEmail');
  if (adminEmailEl) adminEmailEl.textContent = user.email;

  // Logout listener
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      PadhoAuth.logout();
    });
  }

  // Initialize specific page views
  if (document.getElementById('adminDashboardStats')) {
    initAdminDashboard();
  }
  if (document.getElementById('adminExamsTableBody')) {
    initAdminExaminations();
  }
  if (document.getElementById('adminSubjectsTableBody')) {
    initAdminSubjects();
  }
  if (document.getElementById('adminTopicsTableBody')) {
    initAdminTopics();
  }
  if (document.getElementById('adminResourcesTableBody')) {
    initAdminResourcesList();
  }
  if (document.getElementById('adminUploadForm')) {
    initAdminUploadForm();
  }
  if (document.getElementById('adminMessagesTableBody')) {
    initAdminMessages();
  }
  if (document.getElementById('adminSettingsContainer')) {
    initAdminSettings();
  }
});

/**
 * A. Admin Dashboard Overview
 */
async function initAdminDashboard() {
  const exams = await PadhoData.getExaminations();
  const subjects = await PadhoData.getSubjects();
  const topics = await PadhoData.getTopics();
  const resources = await PadhoData.getResources({ publishedOnly: false });
  const messages = await PadhoData.getContactMessages();

  const countExamsEl = document.getElementById('statTotalExams');
  if (countExamsEl) countExamsEl.textContent = exams.length;

  const countSubjEl = document.getElementById('statTotalSubjects');
  if (countSubjEl) countSubjEl.textContent = subjects.length;

  const countTopicsEl = document.getElementById('statTotalTopics');
  if (countTopicsEl) countTopicsEl.textContent = topics.length;

  const countResEl = document.getElementById('statTotalResources');
  if (countResEl) countResEl.textContent = resources.length;

  const countMsgEl = document.getElementById('statUnreadMessages');
  const unreadCount = messages.filter(m => m.status === 'unread').length;
  if (countMsgEl) countMsgEl.textContent = unreadCount;

  // Recent messages snippet
  const recentMsgContainer = document.getElementById('adminRecentMessagesList');
  if (recentMsgContainer) {
    const recents = messages.slice(0, 5);
    if (recents.length === 0) {
      recentMsgContainer.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:24px; color:var(--text-secondary);">No contact inquiries received yet.</td></tr>`;
    } else {
      recentMsgContainer.innerHTML = recents.map(m => `
        <tr>
          <td><strong>${m.name}</strong></td>
          <td>${m.email}</td>
          <td style="max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.message}</td>
          <td><span class="status-pill ${m.status === 'unread' ? 'status-unread' : 'status-read'}">${m.status}</span></td>
        </tr>
      `).join('');
    }
  }
}

/**
 * B. Manage Examinations
 */
async function initAdminExaminations() {
  const tbody = document.getElementById('adminExamsTableBody');
  const addBtn = document.getElementById('openAddExamModalBtn');
  const modal = document.getElementById('examModal');
  const form = document.getElementById('examModalForm');
  const closeModalBtn = document.getElementById('closeExamModalBtn');

  async function loadTable() {
    const exams = await PadhoData.getExaminations();
    tbody.innerHTML = exams.map(exam => `
      <tr>
        <td><strong>${exam.title}</strong></td>
        <td><span class="badge badge-emerald">${exam.category}</span></td>
        <td style="max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${exam.description}</td>
        <td><a href="${exam.officialWebsite}" target="_blank" rel="noopener" style="font-size:0.85rem; text-decoration:underline;">Portal ↗</a></td>
        <td>
          <button type="button" class="table-action-btn edit-exam-btn" data-exam-id="${exam.examId}">Edit</button>
          <button type="button" class="table-action-btn btn-delete delete-exam-btn" data-exam-id="${exam.examId}">Delete</button>
        </td>
      </tr>
    `).join('');

    // Attach row events
    tbody.querySelectorAll('.edit-exam-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-exam-id');
        const exam = await PadhoData.getExaminationById(id);
        if (exam) {
          document.getElementById('modalExamId').value = exam.examId;
          document.getElementById('modalExamTitle').value = exam.title;
          document.getElementById('modalExamCategory').value = exam.category;
          document.getElementById('modalExamDesc').value = exam.description;
          document.getElementById('modalExamEligibility').value = exam.eligibility;
          document.getElementById('modalExamStructure').value = exam.examStructure || '';
          document.getElementById('modalExamWebsite').value = exam.officialWebsite;
          modal.classList.add('open');
        }
      });
    });

    tbody.querySelectorAll('.delete-exam-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-exam-id');
        if (confirm("Are you sure you want to delete this examination record?")) {
          await PadhoData.deleteExamination(id);
          window.showToast("Examination record removed.");
          loadTable();
        }
      });
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.reset();
      document.getElementById('modalExamId').value = 'exam-' + Date.now();
      modal.classList.add('open');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const examData = {
        examId: document.getElementById('modalExamId').value,
        title: document.getElementById('modalExamTitle').value.trim(),
        category: document.getElementById('modalExamCategory').value,
        description: document.getElementById('modalExamDesc').value.trim(),
        eligibility: document.getElementById('modalExamEligibility').value.trim(),
        examStructure: document.getElementById('modalExamStructure').value.trim(),
        officialWebsite: document.getElementById('modalExamWebsite').value.trim()
      };
      await PadhoData.saveExamination(examData);
      modal.classList.remove('open');
      window.showToast("Examination saved successfully.");
      loadTable();
    });
  }

  loadTable();
}

/**
 * C. Manage Subjects
 */
async function initAdminSubjects() {
  const tbody = document.getElementById('adminSubjectsTableBody');
  const form = document.getElementById('addSubjectForm');
  const examSelect = document.getElementById('subjectExamSelect');

  const exams = await PadhoData.getExaminations();
  if (examSelect) {
    exams.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.examId;
      opt.textContent = e.title;
      examSelect.appendChild(opt);
    });
  }

  async function loadTable() {
    const subjects = await PadhoData.getSubjects();
    tbody.innerHTML = subjects.map(s => {
      const exam = exams.find(e => e.examId === s.examinationId);
      return `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td>${exam ? exam.title : s.examinationId}</td>
          <td>${s.description}</td>
          <td>
            <button type="button" class="table-action-btn btn-delete delete-subject-btn" data-subject-id="${s.subjectId}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.delete-subject-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-subject-id');
        if (confirm("Delete this subject?")) {
          await PadhoData.deleteSubject(id);
          window.showToast("Subject deleted.");
          loadTable();
        }
      });
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newSubject = {
        subjectId: 'subj-' + Date.now(),
        examinationId: document.getElementById('subjectExamSelect').value,
        name: document.getElementById('subjectName').value.trim(),
        description: document.getElementById('subjectDesc').value.trim()
      };
      await PadhoData.saveSubject(newSubject);
      form.reset();
      window.showToast("Subject created successfully.");
      loadTable();
    });
  }

  loadTable();
}

/**
 * D. Manage Topics
 */
async function initAdminTopics() {
  const tbody = document.getElementById('adminTopicsTableBody');
  const form = document.getElementById('addTopicForm');
  const subjSelect = document.getElementById('topicSubjectSelect');

  const subjects = await PadhoData.getSubjects();
  if (subjSelect) {
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.subjectId;
      opt.textContent = s.name;
      subjSelect.appendChild(opt);
    });
  }

  async function loadTable() {
    const topics = await PadhoData.getTopics();
    tbody.innerHTML = topics.map(t => {
      const subj = subjects.find(s => s.subjectId === t.subjectId);
      return `
        <tr>
          <td><strong>${t.title}</strong></td>
          <td>${subj ? subj.name : t.subjectId}</td>
          <td>${t.description}</td>
          <td>
            <button type="button" class="table-action-btn btn-delete delete-topic-btn" data-topic-id="${t.topicId}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.delete-topic-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-topic-id');
        if (confirm("Delete this topic?")) {
          await PadhoData.deleteTopic(id);
          window.showToast("Topic deleted.");
          loadTable();
        }
      });
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newTopic = {
        topicId: 'top-' + Date.now(),
        subjectId: document.getElementById('topicSubjectSelect').value,
        title: document.getElementById('topicTitle').value.trim(),
        description: document.getElementById('topicDesc').value.trim()
      };
      await PadhoData.saveTopic(newTopic);
      form.reset();
      window.showToast("Topic created successfully.");
      loadTable();
    });
  }

  loadTable();
}

/**
 * E. Manage Educational Resources
 */
async function initAdminResourcesList() {
  const tbody = document.getElementById('adminResourcesTableBody');
  const exams = await PadhoData.getExaminations();
  const subjects = await PadhoData.getSubjects();

  async function loadTable() {
    const resources = await PadhoData.getResources({ publishedOnly: false });
    
    tbody.innerHTML = resources.map(res => {
      const exam = exams.find(e => e.examId === res.examinationId);
      const subj = subjects.find(s => s.subjectId === res.subjectId);

      return `
        <tr>
          <td>
            <strong>${res.title}</strong>
            <div style="font-size:0.78rem; color:var(--text-secondary);">${res.educationLevel}</div>
          </td>
          <td>${exam ? exam.title : 'General'}</td>
          <td>${subj ? subj.name : 'General'}</td>
          <td>
            <span class="badge ${res.language === 'Telugu' ? 'badge-telugu' : 'badge-emerald'}">${res.language}</span>
          </td>
          <td><span class="badge badge-neutral">${res.resourceType}</span></td>
          <td>
            <button type="button" class="status-pill ${res.published ? 'status-published' : 'status-draft'} toggle-publish-btn" data-resource-id="${res.resourceId}" style="border:none; cursor:pointer;">
              ${res.published ? 'Published' : 'Draft'}
            </button>
          </td>
          <td>
            <a href="${res.externalUrl || res.storageUrl}" target="_blank" rel="noopener" class="table-action-btn">View</a>
            <button type="button" class="table-action-btn btn-delete delete-resource-btn" data-resource-id="${res.resourceId}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    // Toggle publish
    tbody.querySelectorAll('.toggle-publish-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-resource-id');
        const res = await PadhoData.getResourceById(id);
        if (res) {
          res.published = !res.published;
          await PadhoData.saveResource(res);
          window.showToast(`Resource marked as ${res.published ? 'Published' : 'Draft'}.`);
          loadTable();
        }
      });
    });

    // Delete resource
    tbody.querySelectorAll('.delete-resource-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-resource-id');
        if (confirm("Are you sure you want to delete this educational resource?")) {
          await PadhoData.deleteResource(id);
          window.showToast("Educational resource deleted.");
          loadTable();
        }
      });
    });
  }

  loadTable();
}

/**
 * F. Upload Educational Resource Form
 */
async function initAdminUploadForm() {
  const form = document.getElementById('adminUploadForm');
  const examSelect = document.getElementById('uploadExamSelect');
  const subjSelect = document.getElementById('uploadSubjSelect');
  const topicSelect = document.getElementById('uploadTopicSelect');
  const fileInput = document.getElementById('uploadFileInput');
  const dropzone = document.getElementById('uploadDropzone');
  const filePreview = document.getElementById('filePreviewCard');
  const fileNameDisplay = document.getElementById('previewFileName');
  const fileSizeDisplay = document.getElementById('previewFileSize');
  const removeFileBtn = document.getElementById('removeFileBtn');

  // Populate Exams
  const exams = await PadhoData.getExaminations();
  exams.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e.examId;
    opt.textContent = e.title;
    examSelect.appendChild(opt);
  });

  // Populate subjects dynamically based on chosen exam
  async function updateSubjects() {
    const selectedExam = examSelect.value;
    const subjects = await PadhoData.getSubjects(selectedExam);
    subjSelect.innerHTML = '<option value="">Select Subject</option>';
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.subjectId;
      opt.textContent = s.name;
      subjSelect.appendChild(opt);
    });
    updateTopics();
  }

  async function updateTopics() {
    const selectedSubj = subjSelect.value;
    const topics = await PadhoData.getTopics(selectedSubj);
    topicSelect.innerHTML = '<option value="">Select Topic (Optional)</option>';
    topics.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.topicId;
      opt.textContent = t.title;
      topicSelect.appendChild(opt);
    });
  }

  examSelect.addEventListener('change', updateSubjects);
  subjSelect.addEventListener('change', updateTopics);
  await updateSubjects();

  // File Dropzone Handling
  let selectedFile = null;

  function handleFileSelected(file) {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      alert("File size exceeds 25MB limit. Please upload an optimized file.");
      return;
    }
    selectedFile = file;
    if (fileNameDisplay) fileNameDisplay.textContent = file.name;
    if (fileSizeDisplay) fileSizeDisplay.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    if (filePreview) filePreview.style.display = 'flex';
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelected(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        handleFileSelected(fileInput.files[0]);
      }
    });
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', () => {
      selectedFile = null;
      if (fileInput) fileInput.value = '';
      if (filePreview) filePreview.style.display = 'none';
    });
  }

  // Upload Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('uploadTitle').value.trim();
    const description = document.getElementById('uploadDescription').value.trim();
    const examinationId = examSelect.value;
    const subjectId = subjSelect.value;
    const topicId = topicSelect.value || '';
    const educationLevel = document.getElementById('uploadEduLevel').value;
    const language = document.getElementById('uploadLanguage').value;
    const resourceType = document.getElementById('uploadResourceType').value;
    const externalUrl = document.getElementById('uploadExternalUrl').value.trim();
    const published = document.getElementById('uploadPublishedCheck').checked;

    if (!title || !description || !examinationId || !subjectId) {
      alert("Please fill in all required fields (Title, Description, Examination, Subject).");
      return;
    }

    // In a live Firebase setup, if selectedFile exists, it is uploaded to Firebase Storage ref:
    // const fileRef = storageRef(storage, `educational_resources/${selectedFile.name}`);
    // await uploadBytes(fileRef, selectedFile);
    // const storageUrl = await getDownloadURL(fileRef);

    const resourceId = 'res-' + Date.now();
    const newResource = {
      resourceId,
      title,
      description,
      examinationId,
      subjectId,
      topicId,
      educationLevel,
      language,
      resourceType,
      storageUrl: selectedFile ? URL.createObjectURL(selectedFile) : '',
      externalUrl: externalUrl || (selectedFile ? '#' : 'https://ncert.nic.in'),
      published,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await PadhoData.saveResource(newResource);
    window.showToast("Educational Resource uploaded and recorded successfully!");
    setTimeout(() => {
      window.location.href = 'resources.html';
    }, 1200);
  });
}

/**
 * G. Manage Contact Messages
 */
async function initAdminMessages() {
  const tbody = document.getElementById('adminMessagesTableBody');
  const modal = document.getElementById('messageDetailModal');
  const closeModalBtn = document.getElementById('closeMsgModalBtn');

  async function loadTable() {
    const list = await PadhoData.getContactMessages();

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:32px; color:var(--text-secondary);">No contact submissions found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(m => `
      <tr>
        <td><strong>${m.name}</strong></td>
        <td><a href="mailto:${m.email}">${m.email}</a></td>
        <td style="max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.message}</td>
        <td>
          <button type="button" class="status-pill ${m.status === 'unread' ? 'status-unread' : 'status-read'} toggle-msg-status-btn" data-msg-id="${m.messageId}" style="border:none; cursor:pointer;">
            ${m.status}
          </button>
        </td>
        <td>
          <button type="button" class="table-action-btn view-msg-btn" data-msg-id="${m.messageId}">View Full</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.toggle-msg-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-msg-id');
        const msgs = await PadhoData.getContactMessages();
        const current = msgs.find(m => m.messageId === id);
        if (current) {
          const nextStatus = current.status === 'unread' ? 'reviewed' : 'unread';
          await PadhoData.updateMessageStatus(id, nextStatus);
          window.showToast(`Message marked as ${nextStatus}.`);
          loadTable();
        }
      });
    });

    tbody.querySelectorAll('.view-msg-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-msg-id');
        const msgs = await PadhoData.getContactMessages();
        const msg = msgs.find(m => m.messageId === id);
        if (msg) {
          document.getElementById('msgModalSender').textContent = `${msg.name} (${msg.email})`;
          document.getElementById('msgModalDate').textContent = new Date(msg.createdAt).toLocaleString();
          document.getElementById('msgModalContent').textContent = msg.message;
          modal.classList.add('open');
          // Automatically mark as reviewed
          await PadhoData.updateMessageStatus(id, 'reviewed');
          loadTable();
        }
      });
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  loadTable();
}

/**
 * H. Admin Settings & Firebase Diagnostics
 */
async function initAdminSettings() {
  const statusBadge = document.getElementById('firebaseStatusBadge');
  const apiKeyInput = document.getElementById('settingApiKey');
  const projectIdInput = document.getElementById('settingProjectId');
  const storageBucketInput = document.getElementById('settingStorageBucket');
  const saveConfigBtn = document.getElementById('saveFirebaseConfigBtn');
  const resetSeedBtn = document.getElementById('resetVerifiedSeedBtn');

  // Populate existing
  const currentConfig = window.PADHO_CONFIG;
  if (apiKeyInput && currentConfig.apiKey && !currentConfig.apiKey.includes('REPLACE_WITH')) {
    apiKeyInput.value = currentConfig.apiKey;
  }
  if (projectIdInput) projectIdInput.value = currentConfig.projectId || '';
  if (storageBucketInput) storageBucketInput.value = currentConfig.storageBucket || '';

  if (statusBadge) {
    if (window.isLiveFirebaseConfigured()) {
      statusBadge.className = 'badge badge-emerald';
      statusBadge.textContent = 'Live Cloud Firebase Connected';
    } else {
      statusBadge.className = 'badge badge-gold';
      statusBadge.textContent = 'Local Verified Store (Awaiting Live Cloud Keys)';
    }
  }

  if (saveConfigBtn) {
    saveConfigBtn.addEventListener('click', () => {
      const newConfig = {
        apiKey: apiKeyInput.value.trim(),
        projectId: projectIdInput.value.trim(),
        storageBucket: storageBucketInput.value.trim(),
        authDomain: `${projectIdInput.value.trim()}.firebaseapp.com`,
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:custom"
      };

      if (!newConfig.apiKey || newConfig.apiKey.length < 10) {
        alert("Please provide a valid Firebase API Key.");
        return;
      }

      localStorage.setItem('padho_firebase_config', JSON.stringify(newConfig));
      window.showToast("Firebase configuration saved! Reloading application...");
      setTimeout(() => window.location.reload(), 1400);
    });
  }

  if (resetSeedBtn) {
    resetSeedBtn.addEventListener('click', () => {
      if (confirm("Restore the verified educational database to default official records (NTA, NCERT, SSC, IBPS, RRB)?")) {
        PadhoData.resetToVerifiedDefaults();
        window.showToast("Database restored with official verified records.");
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }
}

