const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.jsx', 'utf8');
const styleMatch = code.match(/const styles = `([\s\S]+?)`;/);
if (styleMatch) {
  fs.writeFileSync('src/pages/Profile.css', styleMatch[1].trim());
  code = code.replace(/const styles = `[\s\S]+?`;\n\n/, '');
  code = code.replace(/<style>\{styles\}<\/style>\n/, '');
  code = code.replace("import { api } from '../services/airtable';", "import { useAirtableData } from '../services/useAirtableData';\nimport './Profile.css';");
  code = code.replace("const { user } = useAuth();", "const { user } = useAuth();\n    const { updateParticipant } = useAirtableData();");
  code = code.replaceAll('api.updateParticipant', 'updateParticipant');
  fs.writeFileSync('src/pages/Profile.jsx', code);
  console.log('Done!');
} else {
  console.log('Style not found');
}
