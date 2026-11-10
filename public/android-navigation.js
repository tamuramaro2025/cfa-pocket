export function backDestination(page, unit) {
  if (page === 'study' || page === 'result') return unit ? `lesson/${unit}` : 'home';
  if (page.startsWith('lesson/')) return 'curriculum';
  return page === 'home' ? null : 'home';
}

export function installKeyboardLayout(win, doc) {
  if (win.CFA_NATIVE?.keyboard) {
    void win.CFA_NATIVE.keyboard.addListener('keyboardDidShow', () => {
      doc.documentElement.classList.add('keyboard-open');
      doc.activeElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    void win.CFA_NATIVE.keyboard.addListener('keyboardDidHide', () => {
      doc.documentElement.classList.remove('keyboard-open');
    });
    return;
  }
  const viewport = win.visualViewport;
  const update = () => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(doc.activeElement?.tagName || '');
    doc.documentElement.classList.toggle('keyboard-open', typing && !!viewport && win.innerHeight - viewport.height > 120);
    if (typing) doc.activeElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  viewport?.addEventListener('resize', update);
  doc.addEventListener('focusin', update);
  doc.addEventListener('focusout', () => win.setTimeout(update, 50));
}
