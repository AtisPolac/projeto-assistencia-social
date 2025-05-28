const express = require('express');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Função para gerar PDF de comprovante de doação
const gerarComprovantePDF = async (req, res) => {
  const { id } = req.params;
  const db = require('../config/database');

  try {
    // Obter dados da doação
    const doacao = await db.query(
      `SELECT d.*, 
              v.nome_completo as nome_assistido, v.cpf as cpf_assistido,
              u.nome as nome_gerenciador,
              c.codigo as codigo_comprovante, c.data_geracao as data_comprovante,
              g.nome as nome_grupo
       FROM doacoes d
       JOIN assistidos a ON d.id_assistido = a.id
       JOIN vulneraveis v ON a.id_vulneravel = v.id
       JOIN utilizadores u ON d.id_gerenciador = u.id
       JOIN grupos g ON a.id_grupo = g.id
       LEFT JOIN comprovantes c ON d.id = c.id_doacao
       WHERE d.id = $1`,
      [id]
    );

    if (doacao.rows.length === 0) {
      return res.status(404).json({ message: 'Doação não encontrada' });
    }

    // Obter itens da doação
    const itens = await db.query(
      `SELECT id.quantidade, 
              i.nome, i.descricao, i.categoria, i.unidade_medida
       FROM itens_doacao id
       JOIN itens i ON id.id_item = i.id
       WHERE id.id_doacao = $1`,
      [id]
    );

    // Criar diretório para comprovantes se não existir
    const comprovantesDir = path.join(__dirname, '../../comprovantes');
    if (!fs.existsSync(comprovantesDir)) {
      fs.mkdirSync(comprovantesDir, { recursive: true });
    }

    // Definir nome do arquivo
    const nomeArquivo = `comprovante_${doacao.rows[0].codigo_comprovante}.pdf`;
    const caminhoArquivo = path.join(comprovantesDir, nomeArquivo);

    // Criar PDF
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(caminhoArquivo);
    doc.pipe(stream);

    // Cabeçalho
    doc.fontSize(20).text('COMPROVANTE DE DOAÇÃO', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Código: ${doacao.rows[0].codigo_comprovante}`, { align: 'center' });
    doc.moveDown(2);

    // Informações da doação
    doc.fontSize(14).text('Informações da Doação', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Data: ${new Date(doacao.rows[0].data_doacao).toLocaleDateString('pt-BR')}`);
    doc.text(`Grupo: ${doacao.rows[0].nome_grupo}`);
    doc.text(`Gerenciador: ${doacao.rows[0].nome_gerenciador}`);
    doc.moveDown();

    // Informações do assistido
    doc.fontSize(14).text('Informações do Assistido', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Nome: ${doacao.rows[0].nome_assistido}`);
    doc.text(`CPF: ${doacao.rows[0].cpf_assistido}`);
    doc.moveDown(2);

    // Itens doados
    doc.fontSize(14).text('Itens Doados', { underline: true });
    doc.moveDown();

    // Tabela de itens
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [250, 80, 150];
    
    // Cabeçalho da tabela
    doc.fontSize(12).text('Item', tableLeft, tableTop);
    doc.text('Quantidade', tableLeft + colWidths[0], tableTop);
    doc.text('Unidade', tableLeft + colWidths[0] + colWidths[1], tableTop);
    
    doc.moveTo(tableLeft, tableTop + 20)
       .lineTo(tableLeft + colWidths[0] + colWidths[1] + colWidths[2], tableTop + 20)
       .stroke();
    
    let tableRow = tableTop + 30;
    
    // Linhas da tabela
    itens.rows.forEach(item => {
      doc.fontSize(12).text(item.nome, tableLeft, tableRow);
      doc.text(item.quantidade.toString(), tableLeft + colWidths[0], tableRow);
      doc.text(item.unidade_medida, tableLeft + colWidths[0] + colWidths[1], tableRow);
      tableRow += 20;
    });
    
    doc.moveDown(2);

    // Observações
    if (doacao.rows[0].observacao) {
      doc.fontSize(14).text('Observações', { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(doacao.rows[0].observacao);
      doc.moveDown(2);
    }

    // Assinaturas
    doc.moveDown(4);
    doc.fontSize(12);
    
    // Linha para assinatura do gerenciador
    doc.moveTo(50, doc.y).lineTo(250, doc.y).stroke();
    doc.text('Assinatura do Gerenciador', 50, doc.y + 5);
    
    // Linha para assinatura do assistido
    doc.moveTo(350, doc.y - 5).lineTo(550, doc.y - 5).stroke();
    doc.text('Assinatura do Assistido', 350, doc.y);

    // Rodapé
    doc.fontSize(10).text(
      `Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    // Finalizar PDF
    doc.end();

    // Aguardar finalização da escrita do arquivo
    stream.on('finish', () => {
      // Atualizar URL do documento no banco de dados
      db.query(
        'UPDATE comprovantes SET url_documento = $1 WHERE id_doacao = $2',
        [caminhoArquivo, id]
      );

      // Enviar arquivo para download
      res.download(caminhoArquivo, nomeArquivo, (err) => {
        if (err) {
          console.error('Erro ao enviar arquivo:', err);
          res.status(500).json({ message: 'Erro ao enviar arquivo do comprovante' });
        }
      });
    });
  } catch (error) {
    console.error('Erro ao gerar PDF do comprovante:', error);
    res.status(500).json({ message: 'Erro ao gerar PDF do comprovante' });
  }
};

module.exports = {
  gerarComprovantePDF
};
