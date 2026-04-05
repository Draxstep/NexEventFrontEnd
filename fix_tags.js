import fs from 'fs';
let c = fs.readFileSync('src/layouts/components/Navbar.jsx', 'utf8');
c = c.replace(/<\s*size=\{18\} className="mr-2" \/>/g, '');
c = c.replace(/import \{ Menu, X, CalendarDays, LogIn, UserPlus,  \} from 'lucide-react';/, "import { Menu, X, CalendarDays, LogIn, UserPlus } from 'lucide-react';");
fs.writeFileSync('src/layouts/components/Navbar.jsx', c);
