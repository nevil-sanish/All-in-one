import puppeteer from 'puppeteer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import fs from 'fs/promises';

const urls = [
  'https://iiitkottayam.ac.in/#!/admin',
  'https://iiitkottayam.ac.in/#!/faculty',
  'https://iiitkottayam.ac.in/#!/home',
  'https://iiitkottayam.ac.in/#!/campus/hostel'
];

const pdfUrls = [
  'https://iiitkottayam.ac.in/data/pdf/Annexure%20I_CSE.pdf',
  'https://iiitkottayam.ac.in/data/pdf/Annexure%20II_AI&DS.pdf',
  'https://iiitkottayam.ac.in/data/pdf/Annexure%20III_ECE.pdf',
  'https://iiitkottayam.ac.in/data/pdf/Annexure%20IV_CY.pdf',
  'https://iiitkottayam.ac.in/data/pdf/Academic%20Calender%20for%202026.pdf'
];

async function scrapePages() {
  let content = "KNOWLEDGE BASE FOR IIIT KOTTAYAM:\n\n";
  console.log("Launching puppeteer...");
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  for (const url of urls) {
    console.log(`Scraping URL: ${url}`);
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Clean up common nav clutter before extracting text
      await page.evaluate(() => {
        document.querySelectorAll('nav, footer, .sidebar').forEach(e => e.remove());
      });
      const text = await page.evaluate(() => document.body.innerText);
      content += `\n\n--- Source: ${url} ---\n\n${text}`;
    } catch(e) {
      console.log(`Failed to scrape ${url}`, e);
    }
    await page.close();
  }
  await browser.close();

  for (const pUrl of pdfUrls) {
    console.log(`Downloading PDF: ${pUrl}`);
    try {
      const response = await fetch(pUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const parsedData = await pdfParse(buffer);
      content += `\n\n--- Source: ${pUrl} ---\n\n${parsedData.text}`;
    } catch (e) {
      console.error(`Failed to parse PDF ${pUrl}:`, e);
    }
  }

  // Clean empty lines to save space
  const cleanContent = content.replace(/\n\s*\n/g, '\n\n');

  const fileContent = `export const CHATBOT_SUGGESTIONS = [
  "Who is the HOD of CSE?",
  "Tell me about the hostel facilities.",
  "When are the midterm exams?",
  "What courses are taught in ECE 3rd semester?"
];

export const CAMPUS_CONTEXT = \`${cleanContent.replace(/`/g, "'").replace(/\$/g, "\\$")}\`;\n`;

  await fs.writeFile('./src/data/chatbotKnowledge.js', fileContent);
  console.log("Successfully wrote campus context to src/data/chatbotKnowledge.js");
}

scrapePages().catch(console.error);
