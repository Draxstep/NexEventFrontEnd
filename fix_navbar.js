import fs from 'fs';
let c = fs.readFileSync('src/layouts/components/Navbar.jsx', 'utf8');

c = c.replace(/import { Menu, X, CalendarDays, LogIn, UserPlus, BarChart3 } from 'lucide-react';/, \"import { Menu, X, CalendarDays, LogIn, UserPlus } from 'lucide-react';\");

c = c.replace(/navLinks\.push\({ id: 'gestion', label: 'Gestión Eventos', path: '\/gestion-eventos' }\);/, \"navLinks.push({ id: 'gestion', label: 'Gestión Eventos', path: '/gestion-eventos' });\n    navLinks.push({ id: 'reportes', label: 'Reportes', path: '/reportes' });\");

c = c.replace(/\s*\{\/\*\s*Admin Reportes Button\s*\*\/\}\s*\{isAdmin && \(\s*<NavLink[\s\S]*?Reportes\s*<\/NavLink>\s*\)\}/, '');
c = c.replace(/\s*\{isAdmin && \(\s*<NavLink[\s\S]*?to=\"\/reportes\"[\s\S]*?Reportes\s*<\/NavLink>\s*\)\}/, '');

fs.writeFileSync('src/layouts/components/Navbar.jsx', c);
