export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^mfe/MFELogo$': '<rootDir>/__mocks__/mfe.ts', // Aponta para o mock correto
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.ts',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
};
