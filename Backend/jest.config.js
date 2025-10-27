module.exports = {
	rootDir: '.',  // ให้ Jest มองทั้งโปรเจกต์ backend
	testMatch: ['**/tests/**/*.test.js'], // มองไฟล์ test ในโฟลเดอร์ tests/
	testEnvironment: 'node',
	collectCoverage: true,
};
