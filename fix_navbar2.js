import fs from 'fs';
let c = fs.readFileSync('src/layouts/components/Navbar.jsx', 'utf8');

c = c.replace(/import { Menu, X, CalendarDays, LogIn, UserPlus, BarChart3 } from 'lucide-react';/, \"import { Menu, X, CalendarDays, LogIn, UserPlus } from 'lucide-react';\");

c = c.replace(/navLinks\.push\(\{ id: 'gestion'[^}]+\}\);/, \"navLinks.push({ id: 'gestion', label: 'Gestión Eventos', path: '/gestion-eventos' });\n    navLinks.push({ id: 'reportes', label: 'Reportes', path: '/reportes' });\");

fs.writeFileSync('src/layouts/components/Navbar.jsx', c);
