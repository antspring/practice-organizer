import { readFile } from 'fs/promises';
import path from 'path';

import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

type RenderDocxInput = {
  templatePath: string;
  data: Record<string, string>;
};

const renderDocxTemplate = async ({ templatePath, data }: RenderDocxInput) => {
  const content = await readFile(templatePath, 'binary');
  const zip = new PizZip(content);
  const document = new Docxtemplater(zip, {
    delimiters: {
      start: '{{',
      end: '}}',
    },
    paragraphLoop: true,
    linebreaks: true,
  });

  document.render(data);

  return document.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });
};

const resolveTemplatePath = (...segments: string[]) => {
  return path.resolve(process.cwd(), 'templates', 'documents', ...segments);
};

export { renderDocxTemplate, resolveTemplatePath };
