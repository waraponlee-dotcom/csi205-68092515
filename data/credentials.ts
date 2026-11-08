type User = {
    email: string,
    pass: string,
    role: string,
    name: string,
    // phone: string,
    other: string,
}

const users: User[] = [
    {
        email: 'admin@company.com',
        pass: 'pass',
        role: 'admin',
        name: 'วรพล ลีลาทนาพร',
        // phone: '0809157278',
        other: '...',
    },
    {
        email: 'user@company.com',
        pass: 'pass',
        role: 'user',
        name: 'วรพล ลีลาทนาพร',
        // phone: '0809157278',
        other: '...',
    },
    {
        email: 'manager@company.com',
        pass: 'pass',
        role: 'manager',
        name: 'วรพล ลีลาทนาพร',
        // phone: '0809157278',
        other: '...',
    },
]

export type Credential = {
    token: string
    email: string
    name: string
    role: string
}

// โอกาสที่การเชื่อมต่อจะล้มเหลว (0 = ไม่ล้มเลย, 0.2 = ล้ม 20%)
// ตั้งเป็น 0.2 ถ้าอยากจำลอง connection refused
const FAIL_RATE = 0

export const login = (email: string, pass: string): Promise<Credential> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() >= FAIL_RATE) {
                const user = users.find((u) => u.email === email && u.pass === pass)
                if (user !== undefined) {
                    //found
                    const newCredential: Credential = {
                        token: crypto.randomUUID(),
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                    //... store newCredential (backend) ...
                    resolve(newCredential)
                } else {
                    //not found
                    reject('user not found')
                }
            } else {
                reject('connection refused')
            }
        }, 1000 + Math.random() * 2000);
    })
}

export const logout = (token: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() >= FAIL_RATE) {
                // extract and compare token and credential (backend)
                // if exist, remove credential (backend)
                resolve('success')
            } else {
                reject('connection refused')
            }
        }, 1000 + Math.random() * 2000);
    })
}