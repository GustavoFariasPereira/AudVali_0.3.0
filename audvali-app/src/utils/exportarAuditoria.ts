import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

function dataEValida(dataStr: string): boolean {
  if (!dataStr) return false;

  let dia: number, mes: number, ano: number;

  if (dataStr.includes("/")) {
    const partes = dataStr.split("/");
    if (partes.length !== 3) return false;
    dia = Number(partes[0]);
    mes = Number(partes[1]) - 1;
    ano = Number(partes[2]);
  } else if (dataStr.includes("-")) {
    const dataLimpa = dataStr.split("T")[0];
    const partes = dataLimpa.split("-");
    if (partes.length !== 3) return false;
    ano = Number(partes[0]);
    mes = Number(partes[1]) - 1;
    dia = Number(partes[2]);
  } else {
    return false;
  }

  if (ano < 1000 || ano > 3000 || mes < 0 || mes > 11 || dia < 1) {
    return false;
  }

  const objetoData = new Date(ano, mes, dia);

  return (
    objetoData.getFullYear() === ano &&
    objetoData.getMonth() === mes &&
    objetoData.getDate() === dia
  );
}

function formatarDataPtBR(data: string): string {
  if (!data || !dataEValida(data)) return "Data inválida";

  const dataLimpa = data.includes("T") ? data.split("T")[0] : data;

  if (dataLimpa.includes("/")) return dataLimpa;

  const [ano, mes, dia] = dataLimpa.split("-");
  return `${dia}/${mes}/${ano}`;
}

export async function exportarAuditoriaPDF(auditoria: any) {

const linhasHtml = (auditoria.produtos ?? [])
  .map(
    (p: any, index: number) => {
      const corFundo = index % 2 === 0 ? "#e3f2fd" : "#ffffff";

      return `
        <tr style="background-color: ${corFundo};">
          <td>${p.codigo}</td>
          <td>${p.nome}</td>
          <td>${formatarDataPtBR(p.validade)}</td>
          <td>${p.quantidade}</td>
        </tr>
      `;
    },
  )
  .join("");


  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Helvetica; padding: 20px; color: #000; }
          h1 { text-align: center; font-size: 26px; margin-bottom: 20px; }
          table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000;
          }
          th,
          td {
            border: 1px solid #000;
            padding: 12px 10px;
            text-align: left;
          }
          thead tr {
            background-color: #f0f0f0 !important;
          }
          th {
            font-size: 16px;
            color: #000;
            text-transform: uppercase;
          }
          tbody td {
            font-size: 16px;
            font-weight: bold;
            color: #000;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          tbody tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
          html,
          body,
          table,
          thead,
          tbody,
          tr,
          th,
          td {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          tbody tr:nth-child(odd) td {
            background-color: #e3f2fd !important;
          }
          tbody tr:nth-child(even) td {
            background-color: #ffffff !important;
          }
        </style>
      </head>
      <body>
        <h1>${auditoria.nome}</h1>
        <p>Gerado em: ${new Date().toLocaleString()}</p>
        <p>Gerado por: ${auditoria.criadoPor ?? "Desconhecido"}</p>
        
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Validade</th>
              <th>Qtd</th>
            </tr>
          </thead>
          <tbody>
            ${linhasHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;

  try {
    const file = await Print.printToFileAsync({
      html: htmlContent,
      base64: true,
    });

    if (!file.base64) {
      console.error("O PDF não foi retornado em Base64.");
      throw new Error("O PDF não foi retornado em Base64.");
    }

    const destino =
      `${FileSystem.documentDirectory}auditoria-${Date.now()}.pdf`;

    await FileSystem.writeAsStringAsync(destino, file.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const info = await FileSystem.getInfoAsync(destino);

    if (!info.exists || !info.size) {
      console.error("O arquivo PDF não foi salvo corretamente.");
      throw new Error("O arquivo PDF não foi salvo corretamente.");
    }

    if (!(await Sharing.isAvailableAsync())) {
      console.error("Compartilhamento indisponível.");
      throw new Error("Compartilhamento indisponível.");
    }

    await Sharing.shareAsync(destino, {
      dialogTitle: "Compartilhar Relatório de Auditoria",
      mimeType: "application/pdf",
      UTI: "com.adobe.pdf",
    });
  } catch (error) {
    console.error("Erro ao gerar ou compartilhar PDF:", error);
  }
}