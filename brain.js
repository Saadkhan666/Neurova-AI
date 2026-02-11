/**
 * NEUROVA CORTEX - Advanced Processing Unit
 * Features: PDF Reading, Text Extraction, System Diagnostics
 */

// 1. PDF & FILE PROCESSOR
const NeuroDocs = {
    async read(file) {
        if (file.type === 'application/pdf') {
            return this.readPDF(file);
        } else if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
            return this.readText(file);
        } else {
            throw new Error("Unsupported file type. Use PDF, TXT, MD, or JSON.");
        }
    },

    readText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    },

    async readPDF(file) {
        // Dynamic Import of PDF.js
        if (!window.pdfjsLib) {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        }
        return fullText;
    },

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
};

// 2. SYSTEM DIAGNOSTICS (Slash Command: /sys)
const NeuroSys = {
    getStats() {
        return `
**System Report**
- **Platform:** ${navigator.platform}
- **Cores:** ${navigator.hardwareConcurrency || 'Unknown'}
- **Memory:** ${navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'Unknown'}
- **Screen:** ${window.screen.width}x${window.screen.height}
- **Online:** ${navigator.onLine ? 'Yes' : 'No'}
- **User Agent:** ${navigator.userAgent}
        `.trim();
    }
};
