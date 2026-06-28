// Read the tool results file and extract CSS
const fs = require('fs');
const path = require('path');

// Read the saved JSON response
const filePath = '/home/erik/.claude-me/projects/-home-erik-Code-unifiedcommunicationsprotocol-client/b1ff7b35-7d21-42cd-a153-d97fd9054565/tool-results/toolu_01TPQno5Z1XgJdzG51mE9Vtd.txt';
const content = fs.readFileSync(filePath, 'utf8');

// Parse JSON to get the HTML content
const json = JSON.parse(content);
const html = json.content;

// Extract CSS from <style> tag
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const css = styleMatch[1];
  
  // Write just the CSS
  fs.writeFileSync('/tmp/relay-design.css', css);
  console.log('✅ Extracted CSS:', css.length, 'bytes');
  console.log('\nFirst 500 chars:');
  console.log(css.substring(0, 500));
} else {
  console.log('❌ No <style> tag found');
}
