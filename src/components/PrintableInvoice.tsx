/**
 * Printable Invoice Component
 * Generates a properly formatted invoice that can be printed or saved as PDF
 */

"use client";

import { useRef } from "react";
import { Printer } from "lucide-react";
import { Sale } from "@/models/sale.model";
import { useTranslation } from "@/i18n/provider";
import { colors } from "@/widgets/ui";

interface PrintableInvoiceProps {
  sale: Sale;
}

export default function PrintableInvoice({ sale }: PrintableInvoiceProps) {
  const { t } = useTranslation();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${t.sales.invoiceTitle} ${sale.invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              padding: 40px;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #6750A4;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #6750A4;
            }
            .company-info {
              font-size: 12px;
              color: #666;
              margin-top: 8px;
            }
            .invoice-title {
              text-align: right;
            }
            .invoice-title h1 {
              font-size: 36px;
              color: #6750A4;
              margin-bottom: 8px;
            }
            .invoice-number {
              font-size: 14px;
              color: #666;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .detail-section {
              flex: 1;
            }
            .detail-section h3 {
              font-size: 12px;
              color: #999;
              text-transform: uppercase;
              margin-bottom: 8px;
            }
            .detail-section p {
              font-size: 14px;
              margin-bottom: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background: #6750A4;
              color: white;
              padding: 12px 8px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
            }
            td {
              padding: 12px 8px;
              border-bottom: 1px solid #eee;
              font-size: 14px;
            }
            .text-right {
              text-align: right;
            }
            .totals {
              margin-left: auto;
              width: 300px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
            }
            .totals-row.total {
              border-top: 2px solid #6750A4;
              font-weight: bold;
              font-size: 18px;
              padding-top: 12px;
              margin-top: 8px;
              color: #6750A4;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            .footer p {
              font-size: 14px;
              color: #6750A4;
              margin-bottom: 8px;
            }
            .footer-small {
              font-size: 11px;
              color: #999;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <div class="company-name">${t.sales.companyName}</div>
              <div class="company-info">
                ${t.sales.companyAddress}<br>
                ${t.sales.companyPhone}
              </div>
            </div>
            <div class="invoice-title">
              <h1>${t.sales.invoiceTitle}</h1>
              <div class="invoice-number">${t.sales.invoiceNumber}: ${sale.invoiceNumber}</div>
              <div class="invoice-number">${t.sales.date}: ${sale.date}</div>
            </div>
          </div>
          
          <div class="invoice-details">
            <div class="detail-section">
              <h3>${t.sales.customer}</h3>
              <p><strong>${sale.customerName}</strong></p>
            </div>
            <div class="detail-section">
              <h3>${t.sales.paymentMethod}</h3>
              <p>${t.sales.paymentMethods[sale.paymentMethod] || sale.paymentMethod}</p>
            </div>
            <div class="detail-section">
              <h3>${t.products.status}</h3>
              <p>${t.sales[sale.status] || sale.status}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>${t.sales.product}</th>
                <th class="text-right">${t.sales.quantity}</th>
                <th class="text-right">${t.sales.unitPrice}</th>
                <th class="text-right">${t.sales.subtotal}</th>
              </tr>
            </thead>
            <tbody>
              ${sale.items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">€${item.unitPrice.toFixed(2)}</td>
                  <td class="text-right">€${item.subtotal.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="totals-row">
              <span>${t.sales.subtotal}</span>
              <span>€${sale.subtotal.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>${t.sales.tax} (${sale.tax}%)</span>
              <span>€${sale.taxAmount.toFixed(2)}</span>
            </div>
            <div class="totals-row total">
              <span>${t.sales.total}</span>
              <span>€${sale.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>${t.sales.thankYou}</p>
            <div class="footer-small">
              ${t.sales.companyName} - ${t.sales.companyAddress}
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div>
      <div ref={invoiceRef} style={{ display: 'none' }}>
        {/* Hidden content for printing - handled by window.open */}
      </div>
      <button
        onClick={handlePrint}
        style={{
          width: "100%",
          padding: "12px",
          background: colors.primary,
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <Printer size={18} />
        {t.sales.printInvoice}
      </button>
    </div>
  );
}
