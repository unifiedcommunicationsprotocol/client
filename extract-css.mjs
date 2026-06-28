import fs from 'fs';

const filePath = '/home/erik/.claude-me/projects/-home-erik-Code-unifiedcommunicationsprotocol-client/b1ff7b35-7d21-42cd-a153-d97fd9054565/tool-results/toolu_01TPQno5Z1XgJdzG51mE9Vtd.txt';
const content = fs.readFileSync(filePath, 'utf8');

const json = JSON.parse(content);
const html = json.content;

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const css = styleMatch[1];
  fs.writeFileSync('/tmp/relay-design.css', css);
  console.log('✅ Extracted CSS:', css.length, 'bytes');
  console.log('\nFirst 1000 chars:');
  console.log(css.substring(0, 1000));
} else {
  console.log('❌ No <style> tag found');
}
