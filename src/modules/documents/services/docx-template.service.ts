import { readFile } from 'fs/promises';
import path from 'path';

import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

type RenderDocxInput = {
  templatePath: string;
  data: Record<string, string>;
};

const splitPlaceholderRegex = /<w:t([^>]*)>\{\{<\/w:t>([\s\S]*?)<w:t[^>]*>\}\}<\/w:t>/g;
const textNodeRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;

const normalizeSplitPlaceholders = (xml: string) => {
  return xml.replace(splitPlaceholderRegex, (match, attributes: string) => {
    const textNodes = [...match.matchAll(textNodeRegex)];
    const placeholder = textNodes.map((textNode) => textNode[1]).join('');

    return `<w:t${attributes}>${placeholder}</w:t>`;
  });
};

const normalizeTemplatePlaceholders = (zip: PizZip) => {
  const files = Object.keys(zip.files).filter((fileName) => /^word\/(document|header\d*|footer\d*)\.xml$/.test(fileName));

  files.forEach((fileName) => {
    const file = zip.file(fileName);

    if (!file) {
      return;
    }

    zip.file(fileName, normalizeSplitPlaceholders(file.asText()));
  });
};

const renderDocxTemplate = async ({ templatePath, data }: RenderDocxInput) => {
  const content = await readFile(templatePath, 'binary');
  const zip = new PizZip(content);
  normalizeTemplatePlaceholders(zip);
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
