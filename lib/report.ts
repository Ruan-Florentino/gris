import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ResourceData } from './data';

export async function generateMineralReport(resource: ResourceData, analysisText: string) {
  // Cria modal temporário em tela para o print
  const reportContainer = document.createElement('div');
  reportContainer.style.position = 'absolute';
  reportContainer.style.top = '-9999px';
  reportContainer.style.left = '-9999px';
  reportContainer.style.width = '800px';
  reportContainer.style.backgroundColor = '#0a0a0a';
  reportContainer.style.color = '#fff';
  reportContainer.style.fontFamily = 'monospace';
  reportContainer.style.padding = '40px';
  reportContainer.style.border = '2px solid #10b981';

  // GRIS Logo and Header
  reportContainer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #3f3f46; padding-bottom: 20px;">
      <div>
        <h1 style="color: #10b981; margin: 0; font-size: 24px;">G.R.I.S.</h1>
        <p style="color: #a1a1aa; margin: 5px 0 0 0; font-size: 12px;">GLOBAL RESOURCE INTELLIGENCE SYSTEM</p>
      </div>
      <div style="text-align: right;">
        <p style="color: #a1a1aa; margin: 0; font-size: 12px;">RELATÓRIO DE INTELIGÊNCIA MINERAL</p>
        <p style="color: #a1a1aa; margin: 0; font-size: 12px;">DATA: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</p>
      </div>
    </div>

    <div style="margin-top: 30px;">
      <h2 style="color: #fff; font-size: 18px; text-transform: uppercase;">ALVO: ${resource.name}</h2>
      
      <table style="width: 100%; margin-top: 20px; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #3f3f46; color: #a1a1aa;">CATEGORIA</td>
          <td style="padding: 10px; border: 1px solid #3f3f46;">${resource.category}</td>
          <td style="padding: 10px; border: 1px solid #3f3f46; color: #a1a1aa;">TIPO</td>
          <td style="padding: 10px; border: 1px solid #3f3f46;">${resource.type}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #3f3f46; color: #a1a1aa;">COORDENADAS</td>
          <td style="padding: 10px; border: 1px solid #3f3f46;">${resource.lat.toFixed(4)}, ${resource.lng.toFixed(4)}</td>
          <td style="padding: 10px; border: 1px solid #3f3f46; color: #a1a1aa;">LOCALIZAÇÃO</td>
          <td style="padding: 10px; border: 1px solid #3f3f46;">${resource.region}, ${resource.country}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #3f3f46; color: #a1a1aa;">TAMANHO EST.</td>
          <td style="padding: 10px; border: 1px solid #3f3f46;">${resource.estimatedSize}</td>
          <td style="padding: 10px; border: 1px solid #3f3f46; color: #a1a1aa;">PROFUNDIDADE</td>
          <td style="padding: 10px; border: 1px solid #3f3f46;">${resource.depth}</td>
        </tr>
      </table>
    </div>

    <div style="margin-top: 30px;">
      <h3 style="color: #10b981; font-size: 14px;">ANÁLISE DO AI ANALYST</h3>
      <div style="background-color: #18181b; padding: 15px; border-left: 2px solid #10b981; margin-top: 10px; font-size: 13px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap;">
        ${analysisText || resource.description || 'Nenhuma análise gerada.'}
      </div>
    </div>

    <div style="margin-top: 50px; text-align: center; border-top: 1px dashed #3f3f46; padding-top: 20px;">
      <p style="color: #10b981; margin: 0; font-size: 12px; text-transform: uppercase;">Documento Classificado</p>
      <p style="color: #71717a; margin: 5px 0 0 0; font-size: 10px;">Assinado Digitalmente por GRIS AI System</p>
    </div>
  `;

  document.body.appendChild(reportContainer);

  try {
    const canvas = await html2canvas(reportContainer, {
      backgroundColor: '#0a0a0a',
      scale: 2,
    });
    
    document.body.removeChild(reportContainer);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`GRIS_Report_${resource.id}.pdf`);
    
  } catch (err) {
    document.body.removeChild(reportContainer);
    console.error("PDF gen fail", err);
  }
}
