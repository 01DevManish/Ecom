import { createHash } from 'crypto';
const salt = 'qh_admin_salt';
const password = 'admin123';
const hash = createHash('sha256').update(`${salt}:${password}`).digest('hex');
console.log('Target Hash:', '80a32b2ce52e8f85bf3ac8eff7eabd75e02b0cef4c8f99aa0b5692acd045cb75');
console.log('Computed Hash:', hash);
console.log('Match:', hash === '80a32b2ce52e8f85bf3ac8eff7eabd75e02b0cef4c8f99aa0b5692acd045cb75');
