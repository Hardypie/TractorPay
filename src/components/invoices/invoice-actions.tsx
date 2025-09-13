'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Printer, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function InvoiceActions() {
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const invoiceContent = document.getElementById('invoice-content');
    if (invoiceContent) {
      html2canvas(invoiceContent).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoice.pdf');
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Invoice',
        text: 'Check out this invoice!',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Link Copied!",
            description: "Invoice link has been copied to your clipboard.",
        });
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Print</span>
      </Button>
      <Button variant="outline" onClick={handleDownload}>
        <Download className="mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Download</span>
      </Button>
      <Button variant="outline" onClick={handleShare}>
        <Share2 className="mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Share</span>
      </Button>
    </div>
  );
}
