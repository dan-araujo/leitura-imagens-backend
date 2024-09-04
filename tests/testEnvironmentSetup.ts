import { server } from '../src/index';

jest.mock('../src/database/db', () => ({
    executeQuery: jest.fn().mockImplementation((query) => {
        if (query.includes('SELECT * FROM measures')) {
            return Promise.resolve([]);
        } else if (query.includes('INSERT INTO measures')) {
            return Promise.resolve({ affectedRows: 1 });
        } else {
            return Promise.resolve([]);
        }
    }),
}));

beforeAll(async () => {
    if (!server.listening) {
        await new Promise<void>((resolve) => server.listen(resolve));
    }
});

afterAll(async () => {
    await new Promise<void>((resolve) => {
        server.close(() => {
            resolve();
        });
    });
});

afterEach(() => {
    jest.clearAllMocks();
});