export const showRaiseTicketDialog = () => {
    return new Promise((resolve) => {
        // Create overlay
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

        // Create dialog
        const dialog = document.createElement('div');
        dialog.style.background = '#fff';
        dialog.style.borderRadius = '14px';
        dialog.style.boxShadow = '0 8px 32px rgba(255,107,107,0.18)';
        dialog.style.padding = '2rem 2.5rem';
        dialog.style.display = 'flex';
        dialog.style.flexDirection = 'column';
        dialog.style.alignItems = 'center';
        dialog.style.minWidth = '320px';

        const title = document.createElement('div');
        title.innerText = 'Raise Ticket?';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '1.3rem';
        title.style.color = '#ff6b6b';
        title.style.marginBottom = '0.7rem';

        const msg = document.createElement('div');
        msg.innerText = 'Are you sure you want to raise a ticket for this evaluation? This action cannot be undone.';
        msg.style.color = '#3f3d56';
        msg.style.fontSize = '1.05rem';
        msg.style.marginBottom = '1.5rem';
        msg.style.textAlign = 'center';

        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.gap = '1.5rem';

        const yesBtn = document.createElement('button');
        yesBtn.innerText = 'Raise Ticket';
        yesBtn.style.background = '#ff6b6b';
        yesBtn.style.color = '#fff';
        yesBtn.style.border = 'none';
        yesBtn.style.padding = '0.6rem 1.5rem';
        yesBtn.style.borderRadius = '8px';
        yesBtn.style.fontWeight = 'bold';
        yesBtn.style.cursor = 'pointer';
        yesBtn.style.fontSize = '1rem';

        const noBtn = document.createElement('button');
        noBtn.innerText = 'Cancel';
        noBtn.style.background = '#585a5c';
        noBtn.style.color = '#ffffff';
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
