import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const typeLabels = {
  wallet_topup: 'Wallet Top-up',
  booking_payment: 'Booking Payment',
  refund: 'Refund',
  earning: 'Rental Earning',
};

/**
 * Generates and downloads a PDF statement of the user's transactions.
 * @param {Array} transactions - list of transaction objects
 * @param {Object} user - { name, email, role }
 * @param {Number} walletBalance - current wallet balance to show in summary
 */
export function generateTransactionPDF(transactions, user, walletBalance) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ── Header ──
  doc.setFillColor(15, 23, 42); // brand dark
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('RideWave', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Transaction Statement', 14, 26);

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`, pageWidth - 14, 18, { align: 'right' });

  // ── Account Summary Block ──
  let y = 50;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Account Summary', 14, y);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Name:`, 14, y);
  doc.setTextColor(15, 23, 42);
  doc.text(`${user?.name || '—'}`, 45, y);

  doc.setTextColor(71, 85, 105);
  doc.text(`Email:`, 110, y);
  doc.setTextColor(15, 23, 42);
  doc.text(`${user?.email || '—'}`, 135, y);

  y += 7;
  doc.setTextColor(71, 85, 105);
  doc.text(`Role:`, 14, y);
  doc.setTextColor(15, 23, 42);
  doc.text(`${(user?.role || '—').toUpperCase()}`, 45, y);

  doc.setTextColor(71, 85, 105);
  doc.text(`Wallet Balance:`, 110, y);
  doc.setTextColor(16, 150, 100);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${walletBalance ?? 0}`, 145, y);

  y += 12;

  // ── Summary totals ──
  const totals = transactions.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + t.amount;
    return acc;
  }, {});

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Summary', 14, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  Object.entries(totals).forEach(([type, amount]) => {
    doc.setTextColor(71, 85, 105);
    doc.text(`${typeLabels[type] || type}:`, 14, y);
    doc.setTextColor(15, 23, 42);
    doc.text(`Rs. ${amount}`, 70, y);
    y += 6;
  });

  y += 6;

  // ── Transactions Table ──
  const rows = transactions.map(t => [
    new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    typeLabels[t.type] || t.type,
    t.description || '—',
    (t.paymentMethod || '—').toUpperCase(),
    `Rs. ${t.amount}`,
    t.gatewayRef || '—',
    t.status,
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Date', 'Type', 'Description', 'Method', 'Amount', 'Reference', 'Status']],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      4: { halign: 'right', fontStyle: 'bold' },
      6: { halign: 'center' },
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('RideWave — Bike & Scooter Rental Platform', 14, pageHeight - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
  }

  const filename = `RideWave_Statement_${user?.name?.replace(/\s+/g, '_') || 'User'}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
