export const showSendEvaluationDialog = () => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;

    const dialog = document.createElement('div');
    dialog.style.background = '#fff';
    dialog.style.borderRadius = '14px';
    dialog.style.boxShadow = '0 8px 32px rgba(60,60,120,0.18)';
    dialog.style.padding = '2rem 2.5rem';
    dialog.style.display = 'flex';
    dialog.style.flexDirection = 'column';
    dialog.style.alignItems = 'center';
    dialog.style.minWidth = '320px';

    const title = document.createElement('div');
    title.innerText = 'Send Evaluation?';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.3rem';
    title.style.color = ' #007bff';
    title.style.marginBottom = '0.7rem';

    const msg = document.createElement('div');
    msg.innerText = 'Are you sure you want to send the evaluation for this exam?';
    msg.style.color = '#3f3d56';
    msg.style.fontSize = '1.05rem';
    msg.style.marginBottom = '1.5rem';
    msg.style.textAlign = 'center';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '1.5rem';

    const yesBtn = document.createElement('button');
    yesBtn.innerText = 'Send';
    yesBtn.style.background = ' #007bff';
    yesBtn.style.color = '#fff';
    yesBtn.style.border = 'none';
    yesBtn.style.padding = '0.6rem 1.5rem';
    yesBtn.style.borderRadius = '8px';
    yesBtn.style.fontWeight = 'bold';
    yesBtn.style.cursor = 'pointer';
    yesBtn.style.fontSize = '1rem';

    const noBtn = document.createElement('button');
    noBtn.innerText = 'Cancel';
    noBtn.style.background = ' #585a5c';
    noBtn.style.color = ' #ffffff';
    noBtn.style.border = 'none';
    noBtn.style.padding = '0.6rem 1.5rem';
    noBtn.style.borderRadius = '8px';
    noBtn.style.fontWeight = 'bold';
    noBtn.style.cursor = 'pointer';
    noBtn.style.fontSize = '1rem';

    yesBtn.onclick = () => {
    document.body.removeChild(overlay);
    resolve(true);
    };
    noBtn.onclick = () => {
    document.body.removeChild(overlay);
    resolve(false);
    };

    btnRow.appendChild(yesBtn);
    btnRow.appendChild(noBtn);

    dialog.appendChild(title);
    dialog.appendChild(msg);
    dialog.appendChild(btnRow);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  });
};

export const showFlagEvaluationsDialog = () => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;

    const dialog = document.createElement('div');
    dialog.style.background = '#fff';
    dialog.style.borderRadius = '14px';
    dialog.style.boxShadow = '0 8px 32px rgba(60,60,120,0.18)';
    dialog.style.padding = '2rem 2.5rem';
    dialog.style.display = 'flex';
    dialog.style.flexDirection = 'column';
    dialog.style.alignItems = 'center';
    dialog.style.minWidth = '320px';

    const title = document.createElement('div');
    title.innerText = 'Flag Evaluations?';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.3rem';
    title.style.color = ' #df610d';
    title.style.marginBottom = '0.7rem';

    const msg = document.createElement('div');
    msg.innerText = 'Are you sure you want to flag the evaluations for this exam?';
    msg.style.color = '#3f3d56';
    msg.style.fontSize = '1.05rem';
    msg.style.marginBottom = '1.5rem';
    msg.style.textAlign = 'center';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '1.5rem';

    const yesBtn = document.createElement('button');
    yesBtn.innerText = 'Flag';
    yesBtn.style.background = ' #df610d';
    yesBtn.style.color = '#fff';
    yesBtn.style.border = 'none';
    yesBtn.style.padding = '0.6rem 1.5rem';
    yesBtn.style.borderRadius = '8px';
    yesBtn.style.fontWeight = 'bold';
    yesBtn.style.cursor = 'pointer';
    yesBtn.style.fontSize = '1rem';

    const noBtn = document.createElement('button');
    noBtn.innerText = 'Cancel';
    noBtn.style.background = ' #585a5c';
    noBtn.style.color = ' #ffffff';
    noBtn.style.border = 'none';
    noBtn.style.padding = '0.6rem 1.5rem';
    noBtn.style.borderRadius = '8px';
    noBtn.style.fontWeight = 'bold';
    noBtn.style.cursor = 'pointer';
    noBtn.style.fontSize = '1rem';

    yesBtn.onclick = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };
    noBtn.onclick = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };

    btnRow.appendChild(yesBtn);
    btnRow.appendChild(noBtn);

    dialog.appendChild(title);
    dialog.appendChild(msg);
    dialog.appendChild(btnRow);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  });
};

export const showMarkAsDoneDialog = () => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;

    const dialog = document.createElement('div');
    dialog.style.background = '#fff';
    dialog.style.borderRadius = '14px';
    dialog.style.boxShadow = '0 8px 32px rgba(60,60,120,0.18)';
    dialog.style.padding = '2rem 2.5rem';
    dialog.style.display = 'flex';
    dialog.style.flexDirection = 'column';
    dialog.style.alignItems = 'center';
    dialog.style.minWidth = '320px';

    const title = document.createElement('div');
    title.innerText = 'Mark Exam as Complete?';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.3rem';
    title.style.color = ' #28a745';
    title.style.marginBottom = '0.7rem';

    const msg = document.createElement('div');
    msg.innerText = 'Are you sure you want to mark this exam as completed?';
    msg.style.color = '#3f3d56';
    msg.style.fontSize = '1.05rem';
    msg.style.marginBottom = '1.5rem';
    msg.style.textAlign = 'center';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '1.5rem';

    const yesBtn = document.createElement('button');
    yesBtn.innerText = 'Mark as Complete';
    yesBtn.style.background = ' #28a745';
    yesBtn.style.color = '#fff';
    yesBtn.style.border = 'none';
    yesBtn.style.padding = '0.6rem 1.5rem';
    yesBtn.style.borderRadius = '8px';
    yesBtn.style.fontWeight = 'bold';
    yesBtn.style.cursor = 'pointer';
    yesBtn.style.fontSize = '1rem';

    const noBtn = document.createElement('button');
    noBtn.innerText = 'Cancel';
    noBtn.style.background = ' #585a5c';
    noBtn.style.color = ' #ffffff';
    noBtn.style.border = 'none';
    noBtn.style.padding = '0.6rem 1.5rem';
    noBtn.style.borderRadius = '8px';
    noBtn.style.fontWeight = 'bold';
    noBtn.style.cursor = 'pointer';
    noBtn.style.fontSize = '1rem';

    yesBtn.onclick = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };
    noBtn.onclick = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };

    btnRow.appendChild(yesBtn);
    btnRow.appendChild(noBtn);

    dialog.appendChild(title);
    dialog.appendChild(msg);
    dialog.appendChild(btnRow);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  });
};

export const showDeleteExamDialog = () => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;

    const dialog = document.createElement('div');
    dialog.style.background = '#fff';
    dialog.style.borderRadius = '14px';
    dialog.style.boxShadow = '0 8px 32px rgba(192,57,43,0.18)';
    dialog.style.padding = '2rem 2.5rem';
    dialog.style.display = 'flex';
    dialog.style.flexDirection = 'column';
    dialog.style.alignItems = 'center';
    dialog.style.minWidth = '320px';

    const title = document.createElement('div');
    title.innerText = 'Delete Exam?';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.3rem';
    title.style.color = '#c0392b';
    title.style.marginBottom = '0.7rem';

    const msg = document.createElement('div');
    msg.innerText = 'Are you sure you want to delete this exam? This action cannot be undone.';
    msg.style.color = '#3f3d56';
    msg.style.fontSize = '1.05rem';
    msg.style.marginBottom = '1.5rem';
    msg.style.textAlign = 'center';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '1.5rem';

    const yesBtn = document.createElement('button');
    yesBtn.innerText = 'Delete';
    yesBtn.style.background = '#c0392b';
    yesBtn.style.color = '#fff';
    yesBtn.style.border = 'none';
    yesBtn.style.padding = '0.6rem 1.5rem';
    yesBtn.style.borderRadius = '8px';
    yesBtn.style.fontWeight = 'bold';
    yesBtn.style.cursor = 'pointer';
    yesBtn.style.fontSize = '1rem';

    const noBtn = document.createElement('button');
    noBtn.innerText = 'Cancel';
    noBtn.style.background = ' #585a5c';
    noBtn.style.color = ' #ffffff';
    noBtn.style.border = 'none';
    noBtn.style.padding = '0.6rem 1.5rem';
    noBtn.style.borderRadius = '8px';
    noBtn.style.fontWeight = 'bold';
    noBtn.style.cursor = 'pointer';
    noBtn.style.fontSize = '1rem';

    yesBtn.onclick = () => {
    document.body.removeChild(overlay);
    resolve(true);
    };
    noBtn.onclick = () => {
    document.body.removeChild(overlay);
    resolve(false);
    };

    btnRow.appendChild(yesBtn);
    btnRow.appendChild(noBtn);

    dialog.appendChild(title);
    dialog.appendChild(msg);
    dialog.appendChild(btnRow);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  });
};