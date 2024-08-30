module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json'}],
        '^.+\\.js$': 'babel-jest'
    },
    setupFilesAfterEnv: ['./setupTests.ts'],
};