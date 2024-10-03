const fs = require('fs');
const path = require('path');

// Define the paths you want to scan for your project structure
const projectDir = path.join(__dirname);

// Helper function to get a list of files and directories
function getProjectStructure(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let structure = '';

  entries.forEach(entry => {
    if (entry.isDirectory()) {
      structure += `${prefix}- ${entry.name}/\n`;
      structure += getProjectStructure(path.join(dir, entry.name), prefix + '  ');
    } else {
      structure += `${prefix}- ${entry.name}\n`;
    }
  });

  return structure;
}

// Append the auto-generated structure to the existing README
function appendToReadme() {
  const projectName = path.basename(projectDir);
  const structure = getProjectStructure(projectDir);

  const newContent = `
## Auto-Generated Project Structure

\`\`\`
${structure}
\`\`\`
  `;

  // Check if README exists
  const readmePath = path.join(__dirname, 'README.md');
  let existingContent = '';

  if (fs.existsSync(readmePath)) {
    existingContent = fs.readFileSync(readmePath, 'utf8');
  }

  // Combine existing content with new project structure
  const updatedReadme = `${existingContent}\n${newContent}`;

  // Write the updated README
  fs.writeFileSync(readmePath, updatedReadme, 'utf8');
  console.log('README.md updated successfully!');
}

appendToReadme();
